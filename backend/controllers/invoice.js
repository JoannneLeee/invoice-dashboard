import db from "../connect.js";
import { fillMissingDates, fillWeeklyData} from "../utils/helper.js";

export const addInvoice = async (req, res) => {
  const { date, customer, salesperson, products, notes } = req.body;

  if (
    !date ||
    !customer ||
    !salesperson ||
    !products ||
    products.length === 0
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({
        error: "Transaction error",
        details: err,
      });
    }

    const invoiceQuery = `
            INSERT INTO invoice (date, customer, salesperson, notes) 
            VALUES (?, ?, ?, ?)
        `;

    db.query(
      invoiceQuery,
      [date, customer, salesperson, notes || null],
      (err, invoiceResult) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({
              error: "Failed to create invoice",
              details: err.message,
            });
          });
        }

        const invoiceId = invoiceResult.insertId;

        const orderItemsQuery = `
                INSERT INTO order_items (invoice_id, product_id, quantity) 
                VALUES ?
            `;
        const orderItemsData = products.map((product) => [
          invoiceId,
          product.product_id,
          product.quantity,
        ]);

        db.query(orderItemsQuery, [orderItemsData], (err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({
                error: "Failed to add products",
                details: err.message,
              });
            });
          }

          const totalAmountQuery = `
              SELECT ROUND(SUM(p.price * oi.quantity), 2) AS total_amount 
              FROM order_items oi 
              JOIN products p ON oi.product_id = p.id 
              WHERE oi.invoice_id = ?
          `;

          db.query(totalAmountQuery, [invoiceId], (err, totalResult) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({
                  error: "Failed to calculate total",
                  details: err.message,
                });
              });
            }

            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({
                    error: "Failed to commit transaction",
                    details: err.message,
                  });
                });
              }

              res.status(201).json({
                success: true,
                message: "Invoice added successfully",
                data: {
                  id: invoiceId,
                  date,
                  customer,
                  salesperson,
                  notes,
                  total_amount: totalResult[0].total_amount,
                },
                products: products.map((product) => ({
                  product_id: product.product_id,
                  quantity: product.quantity,
                })),
              });
            });
          });
        });
      }
    );
  });
};

export const getInvoice = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const offset = (page - 1) * limit;

  const countQuery = "SELECT COUNT(*) as total FROM invoice";

  db.query(countQuery, (err, countResult) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    const query = `
      SELECT 
        i.*,
        COALESCE(SUM(oi.quantity * p.price), 0) as total_amount
      FROM invoice i
      LEFT JOIN order_items oi ON i.id = oi.invoice_id
      LEFT JOIN products p ON oi.product_id = p.id
      GROUP BY i.id
      LIMIT ${limit} OFFSET ${offset}
    `;

    db.query(query, (err, response, field) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      res.status(200).json({
        success: true,
        data: response,
        pagination: {
          page: page,
          limit: limit,
          total_pages: totalPages,
        },
      });
    });
  });
};

export const getStats = async (req, res) => {
  const { type = "daily" } = req.query;
  const today = new Date();
  let query;

  switch (type) {
    case "daily":
      query = `
        SELECT 
          DATE(i.date) as date,
          COALESCE(SUM(oi.quantity * p.price), 0) as total_revenue
        FROM invoice i
        LEFT JOIN order_items oi ON i.id = oi.invoice_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE i.date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY DATE(i.date)
        ORDER BY date ASC
      `;
      break;

    case "weekly":
      query = `
        SELECT 
          YEARWEEK(i.date) as week,
          MIN(DATE(i.date)) as week_start,
          COALESCE(SUM(oi.quantity * p.price), 0) as total_revenue
        FROM invoice i
        LEFT JOIN order_items oi ON i.id = oi.invoice_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE i.date >= DATE_SUB(CURDATE(), INTERVAL 12 WEEK)
        GROUP BY YEARWEEK(i.date)
        ORDER BY week ASC`;
      break;

    case "monthly":
      query = `
        SELECT 
          DATE_FORMAT(i.date, '%Y-%m') as month,
          MIN(DATE(i.date)) as month_start,
          COALESCE(SUM(oi.quantity * p.price), 0) as total_revenue
        FROM invoice i
        LEFT JOIN order_items oi ON i.id = oi.invoice_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE i.date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(i.date, '%Y-%m')
        ORDER BY month ASC
      `;
      break;

    default:
      return res.status(400).json({
        success: false,
        message: "Invalid type. Use 'daily', 'weekly', or 'monthly'",
      });
  }

  if (type === "weekly") {
    try {
      db.query(query, (err, results) => {
        if (err) {
          return res.status(500).json({ error: err });
        }

        const filledData = fillWeeklyData(results);

        res.status(200).json({
          success: true,
          type,
          data: filledData,
          metadata: {
            total_revenue: filledData.reduce(
              (sum, item) => sum + item.total_revenue,
              0
            ),
            average_revenue:
              filledData.reduce((sum, item) => sum + item.total_revenue, 0) /
              filledData.length,
            period_start: filledData[0].week_start,
            period_end: filledData[filledData.length - 1].week_start,
          },
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    try {
      db.query(query, (err, results) => {
        if (err) {
          return res.status(500).json({ error: err });
        }

        const filledData = fillMissingDates(results, type);

        res.status(200).json({
          success: true,
          type,
          data: filledData,
          metadata: {
            total_revenue: filledData.reduce(
              (sum, item) => sum + item.total_revenue,
              0
            ),
            average_revenue:
              filledData.reduce((sum, item) => sum + item.total_revenue, 0) /
              filledData.length,
            period_start:
              filledData[0].date ||
              filledData[0].week_start ||
              filledData[0].month_start,
            period_end:
              filledData[filledData.length - 1].date ||
              filledData[filledData.length - 1].week_start ||
              filledData[filledData.length - 1].month_start,
          },
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
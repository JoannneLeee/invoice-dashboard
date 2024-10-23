import db from '../connect.js'

export const getProducts = (req, res) => {
    const query = 'SELECT * FROM products'
    db.query(query, (err, response, field) => {
      if(err) {
        return res.status(500).json({error: err})
      }
      res.status(200).json({success: true, data: response})
    })
};

export const searchProducts = (req, res) => {
  try {
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term is required' });
    }

    db.query(
      `SELECT id, name, price, stock, image 
       FROM products 
       WHERE name LIKE ?`,
      [`%${searchTerm}%`],
      (error, results) => {
        if (error) {
          console.error("Error searching for products:", error);
          return res.status(500).json({ error: 'Failed to search products' });
        }

        res.json(results);
      }
    );
  } catch (error) {
    console.error("Error searching for products:", error);
    res.status(500).json({ error: 'Failed to search products' });
  }
};

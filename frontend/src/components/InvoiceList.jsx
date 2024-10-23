import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInvoices } from "../redux/invoices/Actions";
import moment from "moment";
import { formatNumber } from "../utils/helper";
import Pagination from "./Pagination";

const InvoiceList = () => {
  const dispatch = useDispatch();
  const { invoices, isLoading, totalPages } = useSelector(
    (state) => state.invoice
  );

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 3;

  useEffect(() => {
    dispatch(getInvoices(currentPage, limit));
  }, [dispatch, currentPage, limit]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return isLoading ? (
    <h1>Loading...</h1>
  ) : (
    <>
      <div className="grid grid-cols-1 gap-6 mt-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 text-gray-700">
        {invoices && invoices.length > 0 ? (
          invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="p-5 rounded-lg bg-white drop-shadow-lg"
            >
              <div className="flex justify-between">
                <div>
                  <h1 className="font-extrabold text-[20px]">
                    Rp {formatNumber(invoice.total_amount)}
                  </h1>
                  <h5 className="font-semibold">
                    {moment(invoice.date).format("DD-MM-YYYY")}
                  </h5>
                </div>
                <p>#{invoice.id}</p>
              </div>
              <div className="mt-5 flex flex-col gap-3">
                <h1>Customer: {invoice.customer}</h1>
                <h1>Sales: {invoice.salesperson}</h1>
                <h1>Notes: {invoice.notes ? invoice.notes : ""}</h1>
              </div>
            </div>
          ))
        ) : (
          <h1>no invoices</h1>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
      />
    </>
  );
};

export default InvoiceList;

import React, { useEffect } from "react";
import InvoiceList from "./InvoiceList";

const Invoice = () => {

  return (
    <div className=" w-full bg-gray-100 p-5 rounded-md">
      <div className="flex justify-between">
        <h1 className="text-[30px] font-bold text-gray-800">Invoice</h1>
        <a href="/addinvoice" className="drop-shadow-lg">
          <button className="bg-gray-800 rounded-lg px-8 py-3 text-white font-bold drop-shadow-lg">
            Add Invoice
          </button>
        </a>
      </div>
      <InvoiceList />
    </div>
  );
};

export default Invoice;

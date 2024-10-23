import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addInvoice } from "../redux/addInvoices/Actions";
import toast from "react-hot-toast";
import { redirect, useNavigate } from "react-router-dom";
import InvoiceDetails from "../components/InvoiceDetails";
import ProductList from "../components/ProductList";
import Container from "../components/Container";

const AddInvoice = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading, error, successMessage } = useSelector(
    (state) => state.invoice
  );

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    customer: "",
    salesperson: "",
    notes: "",
    products: [{ product_id: "", quantity: 1 }],
  });

  const [displayData, setDisplayData] = useState({
    products: [
      {
        product_id: "",
        name: "",
        price: 0,
        stock: 0,
        image: "",
        quantity: 1,
      },
    ],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = {
      date: formData.date,
      customer: formData.customer,
      salesperson: formData.salesperson,
      notes: formData.notes,
      products: formData.products.map((product) => ({
        product_id: product.product_id,
        quantity: product.quantity,
      })),
    };

    const result = await dispatch(addInvoice(submissionData));

    if (result.success) {
      toast.success("Successfully Added!");
      navigate("/");
      setFormData({
        date: new Date().toISOString().split("T")[0],
        customer: "",
        salesperson: "",
        notes: "",
        products: [{ product_id: "", quantity: 1 }],
      });
      setDisplayData({
        products: [
          {
            product_id: "",
            name: "",
            price: 0,
            stock: 0,
            image: "",
            quantity: 1,
          },
        ],
      });
    }
  };

  return (
    <Container>
      <div className="max-w-4xl lg:mx-auto xl:mx-auto p-6 bg-gray-100 rounded-lg text-gray-800 drop-shadow-xl">
        <h1 className="text-2xl font-bold mb-6">Create New Invoice</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InvoiceDetails formData={formData} setFormData={setFormData} />
          <ProductList formData={formData} setFormData={setFormData} />

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-800 rounded-lg px-8 py-3 text-white font-bold drop-shadow-lg"
            >
              {isLoading ? "Creating Invoice..." : "Create Invoice"}
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default AddInvoice;

import React from 'react'
import ProductAutocomplete from './ProductAutocomplete';
import { formatNumber } from '../utils/helper';

const ProductList = ({ formData, setFormData }) => {
    const handleProductChange = (index, productData) => {
      const newProducts = [...formData.products];
      newProducts[index] = {
        product_id: productData.product_id,
        quantity: productData.quantity,
        displayData: productData.displayData
      };
      setFormData({
        ...formData,
        products: newProducts
      });
    };
  
    const handleQuantityChange = (index, quantity) => {
      const newProducts = [...formData.products];
      newProducts[index] = {
        ...newProducts[index],
        quantity
      };
      setFormData({
        ...formData,
        products: newProducts
      });
    };
  
    const addProduct = () => {
      setFormData({
        ...formData,
        products: [...formData.products, { 
          product_id: '', 
          quantity: 1,
          displayData: {
            name: '',
            price: 0,
            stock: 0,
            image: ''
          }
        }]
      });
    };
  
    const removeProduct = (index) => {
      if (formData.products.length > 1) {
        const newProducts = formData.products.filter((_, i) => i !== index);
        setFormData({
          ...formData,
          products: newProducts
        });
      }
    };
  
    const total = formData.products.reduce((sum, product) => {
      return sum + (product.displayData?.price || 0) * product.quantity;
    }, 0);
  
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-[20px] font-semibold">Products</h2>
          <button
            type="button"
            onClick={addProduct}
            className="bg-transparent  text-gray-800 font-bold px-4 py-1 rounded outline outline-gray-700 "
          >
            Add Product
          </button>
        </div>
  
        <div className="space-y-4">
          {formData.products.map((product, index) => (
            <ProductAutocomplete
              key={index}
              product={product}
              index={index}
              onProductChange={handleProductChange}
              onQuantityChange={handleQuantityChange}
              onRemove={removeProduct}
              disabled={formData.products.length === 1}
            />
          ))}
        </div>
  
        <div className="flex justify-end pt-4 border-t">
          <div className="text-xl font-bold">
            Total: Rp {formatNumber(total)}
          </div>
        </div>
      </div>
    );
  };

export default ProductList


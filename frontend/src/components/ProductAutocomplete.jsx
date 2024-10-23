import React, { useEffect, useState } from "react";
import { formatNumber } from "../utils/helper";

const ProductAutocomplete = ({
  product,
  index,
  onProductChange,
  onQuantityChange,
  onRemove,
  disabled,
}) => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchSuggestions = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8800/api/products/search?q=${searchTerm}`
      );
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSelectProduct = (selectedProduct) => {
    onProductChange(index, {
      product_id: selectedProduct.id,
      quantity: product.quantity,
      displayData: {
        name: selectedProduct.name,
        price: selectedProduct.price,
        stock: selectedProduct.stock,
        image: selectedProduct.image,
      },
    });
    setSearch(selectedProduct.name);
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className="flex gap-4 relative items-center flex-col lg:flex-row xl:flex-row">
      <div className="flex-1 lg:w-[350px] xl:w-[350px] w-full">
        <label className="block text-sm font-medium mb-1 ">Product</label>
        <div className="relative">
          <input
            type="text"
            value={product.displayData?.name || search}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={handleBlur}
            className="p-2 border rounded lg:w-[350px] xl:w-[350px] w-full"
            placeholder="Search for a product..."
            required
          />

          {isLoading && (
            <div className="absolute right-2 top-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectProduct(suggestion)}
                >
                  <img
                    src={suggestion.image || "/api/placeholder/40/40"}
                    alt={suggestion.name}
                    className="w-10 h-10 object-cover rounded mr-2"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{suggestion.name}</div>
                    <div className="text-sm text-gray-600">
                      Stock: {suggestion.stock} | Price: Rp {formatNumber(suggestion.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full xl:w-30 lg:w-30">
        <label className="block text-sm font-medium mb-1">Quantity</label>
        <input
          type="number"
          value={product.quantity}
          onChange={(e) => onQuantityChange(index, parseInt(e.target.value))}
          min="1"
          max={product.displayData?.stock || 999999}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {product.product_id && (
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Price</label>
          <div className="p-2 bg-gray-50 rounded xl:w-[200px] lg:w-[200px]">
            Rp {formatNumber(product.displayData?.price) || 0}
          </div>
        </div>
      )}

      <div className="flex items-end">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="mb-1 p-2 text-red-500 hover:text-red-700"
          disabled={disabled}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default ProductAutocomplete;

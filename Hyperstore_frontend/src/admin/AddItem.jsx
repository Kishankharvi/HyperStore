import React, { useState } from 'react';
import apiService from '../utils/api';
import toast from 'react-hot-toast';
import '../styles/Admin.css';

const AddItem = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    inStock: true,
    stock: 0,
    image: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.createProduct(productData);
      toast.success('Product added successfully!');
      setProductData({
        name: '',
        description: '',
        price: '',
        category: 'Electronics',
        inStock: true,
        stock: 0,
        image: '',
      });
    } catch (error) {
      toast.error('Failed to add product.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-section">
      <h2 className="admin-section-title">Add New Item</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          name="name"
          value={productData.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
        />
        <textarea
          name="description"
          value={productData.description}
          onChange={handleChange}
          placeholder="Product Description"
          required
        />
        <input
          type="number"
          name="price"
          value={productData.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <select name="category" value={productData.category} onChange={handleChange}>
          <option value="Electronics">Electronics</option>
          <option value="Technology">Technology</option>
          <option value="Displays">Displays</option>
          <option value="Clothing">Clothing</option>
          <option value="Footwear">Footwear</option>
          <option value="Beverages">Beverages</option>
          <option value="Accessories">Accessories</option>
        </select>
        <input
          type="number"
          name="stock"
          value={productData.stock}
          onChange={handleChange}
          placeholder="Stock"
          required
        />
        <input
          type="text"
          name="image"
          value={productData.image}
          onChange={handleChange}
          placeholder="Image URL"
          required
        />
       <label className="checkbox-label">
      <input
       type="checkbox"
    name="inStock"
    checked={productData.inStock}
    onChange={handleChange}
  />
  In Stock
</label>

        <button type="submit" className="admin-button add-new" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddItem;
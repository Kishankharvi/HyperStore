

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import apiService from "../utils/api";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/ProductList.css";

const ProductList = () => {
  // State to hold all products fetched from the API
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Component state will now drive the filtering and sorting logic
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("createdAt");

  // We still use searchParams to get the category, as this is usually a navigation action
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";

  // Effect to fetch all products once when the component mounts
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        // Fetches all products without any search/sort parameters
        const response = await apiService.getProducts(); 
        setAllProducts(response.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // useMemo performs client-side filtering and sorting.
  // It recalculates the list only when the underlying data or filters change.
  const displayedProducts = useMemo(() => {
    let products = [...allProducts];

    // 1. Apply search filter based on the local searchTerm state
    if (searchTerm) {
      products = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 2. Apply category filter based on the URL parameter
    if (category) {
        products = products.filter(product => product.category === category);
    }

    // 3. Apply sorting based on the local sortOption state
    switch (sortOption) {
      case "name":
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price":
        products.sort((a, b) => a.price - b.price);
        break;
      case "-price":
        products.sort((a, b) => b.price - a.price);
        break;
      case "createdAt":
      default:
        // The API already sorts by createdAt, but this ensures consistency
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return products;
  }, [allProducts, searchTerm, category, sortOption]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="product-list">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            {category ? `${category}` : "All Products"}
          </h1>
        </div>
        
        <div className="filters">
          {/* The form element is removed for a more interactive feel */}
          <div className="search-form">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              // Update state on every keystroke for real-time filtering
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {/* The search button is no longer needed for this approach */}
          </div>

          <select className="sort-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="createdAt">Newest</option>
            <option value="name">Name A-Z</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
          </select>
        </div>

        {displayedProducts.length === 0 ? (
          <div className="no-products">
            <h2>No products found</h2>
            <p>Try a different search or browse our categories.</p>
          </div>
        ) : (
          <div className="products-grid">
            {displayedProducts.map((product) => (
              <ProductCard key={product._id} product={{ ...product, id: product._id }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;

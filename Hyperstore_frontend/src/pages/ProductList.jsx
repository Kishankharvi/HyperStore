"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import apiService from "../utils/api"
import ProductCard from "../components/ProductCard"
import LoadingSpinner from "../components/LoadingSpinner"
import "../styles/ProductList.css"

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Get initial values from URL or set defaults
  const initialSearch = searchParams.get("search") || ""
  const category = searchParams.get("category") || ""
  const sort = searchParams.get("sort") || "createdAt"

  // State for the search input box
  const [searchTerm, setSearchTerm] = useState(initialSearch)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = {
          search: initialSearch,
          category,
          sort,
          limit: 20,
        }

        // Clean up empty params
        Object.keys(params).forEach((key) => {
          if (!params[key]) delete params[key]
        })

        const response = await apiService.getProducts(params)
        setProducts(response.products)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [initialSearch, category, sort])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.set("search", searchTerm)
      return newParams
    })
  }

  const handleSortChange = (e) => {
    const newSort = e.target.value
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.set("sort", newSort)
      return newParams
    })
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="product-list">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            {initialSearch ? `Searching for "${initialSearch}"` : category ? `${category}` : "All Products"}
          </h1>
        </div>
        
        <div className="filters">
          {/* New Search Input Box Form */}
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">Search</button>
          </form>

          <select className="sort-select" value={sort} onChange={handleSortChange}>
            <option value="createdAt">Newest</option>
            <option value="name">Name A-Z</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
          </select>
        </div>

        {products.length === 0 ? (
          <div className="no-products">
            <h2>No products found</h2>
            <p>Try a different search or browse our categories.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={{ ...product, id: product._id }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductList
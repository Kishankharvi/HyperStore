import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FiArrowRight, FiZap, FiShield, FiStar } from "react-icons/fi"
import apiService from "../utils/api"
import ProductCard from "../components/ProductCard"
import LoadingSpinner from "../components/LoadingSpinner"
import "../styles/Home.css"

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await apiService.getProducts({ limit: 4 })
        setFeaturedProducts(response.products)
      } catch (error) {
        console.error("Error fetching featured products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to the <span className="gradient-text">Future</span>
          </h1>
          <p className="hero-subtitle">Discover cutting-edge products in our futuristic marketplace</p>
          <Link to="/products" className="cta-button">
            Explore Products <FiArrowRight size={20} />
          </Link>
        </div>
        <div className="hero-visual">
          <div className="floating-elements">
            <div className="floating-element"></div>
            <div className="floating-element"></div>
            <div className="floating-element"></div>
          </div>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={{ ...product, id: product._id }} />
            ))}
          </div>
          <div className="section-footer">
            <Link to="/products" className="view-all-btn">
              View All Products
            </Link>
          </div>
        </div>
      </section>

  
    </div>
  )
}

export default Home

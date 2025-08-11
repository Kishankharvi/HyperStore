  "use client"

  import { useState, useEffect, useContext } from "react"
  import { useParams, useNavigate } from "react-router-dom"
  import apiService from "../utils/api"
  import { CartContext } from "../utils/CartContext"
  import LoadingSpinner from "../components/LoadingSpinner"
  import "../styles/ProductDetail.css"

  const ProductDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addToCart } = useContext(CartContext)

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [addedToCart, setAddedToCart] = useState(false)

    useEffect(() => {
      const fetchProduct = async () => {
        try {
          const productData = await apiService.getProduct(id)
          setProduct(productData)
        } catch (error) {
          console.error("Error fetching product:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchProduct()
    }, [id])

    const handleAddToCart = () => {
      if (product) {
        addToCart({ ...product, id: product._id }, quantity)
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 2000)
      }
    }

    const handleQuantityChange = (change) => {
      const newQuantity = quantity + change
      if (newQuantity >= 1 && newQuantity <= (product?.stock || 99)) {
        setQuantity(newQuantity)
      }
    }

    if (loading) {
      return <LoadingSpinner />
    }

    if (!product) {
      return (
        <div className="product-detail">
          <div className="container">
            <div className="product-not-found">
              <h2>Product not found</h2>
              <button onClick={() => navigate("/products")} className="btn-primary">
                Back to Products
              </button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="product-detail">
        <div className="container">
          <button onClick={() => navigate(-1)} className="back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
            Back
          </button>

          <div className="product-detail-content">
            <div className="product-image-section">
              <img
                src={product.image || "/placeholder.svg?height=500&width=500"}
                alt={product.name}
                className="product-detail-image"
              />
            </div>

            <div className="product-info-section">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-price">${product.price}</div>
              <p className="product-description">{product.description}</p>

              <div className="product-actions">
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button className="quantity-btn" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                      -
                    </button>
                    <input
                      type="number"
                      className="quantity-input"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                      min="1"
                      max={product.stock || 99}
                    />
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= (product.stock || 99)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`add-to-cart-btn ${addedToCart ? "added" : ""}`}
                  disabled={!product.inStock}
                >
                  {addedToCart ? (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h8a1 1 0 001-1v-6m-9 0h10" />
                      </svg>
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </>
                  )}
                </button>
              </div>

              {product.features && product.features.length > 0 && (
                <div className="product-features">
                  <h3>Features</h3>
                  <ul>
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  export default ProductDetail

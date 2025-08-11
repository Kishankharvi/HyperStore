import { Link } from "react-router-dom"
import "../styles/ProductCard.css"

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image-container">
          <img
            src={product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            className="product-image"
          />
          <div className="product-overlay">
            <span className="view-details">View Details</span>
          </div>
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
          <div className="product-price">${product.price}</div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard

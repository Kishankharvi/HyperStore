
import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { CartContext } from "../utils/CartContext"
import { AuthContext } from "../utils/AuthContext"
import apiService from "../utils/api"
import "../styles/Checkout.css"
import toast from "react-hot-toast"

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
    country: user?.address?.country || "United States",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const orderData = {
      items: cartItems.map((item) => ({
        product: item._id || item.id,
        quantity: item.quantity,
      })),
      shippingAddress: formData,
      paymentMethod: "card",
    }

    // Optimistic UI update: Assume the order will be placed successfully.
    // The service worker will handle queueing if offline.
    if (!navigator.onLine) {
        toast.success('You are offline. Your order has been saved and will be placed automatically when you reconnect.');
        clearCart();
        navigate('/profile?orderQueued=true');
        return;
    }

    try {
      const order = await apiService.createOrder(orderData)
      toast.success("Order placed successfully!");
      clearCart()
      navigate(`/profile?orderSuccess=${order._id}`)
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const subtotal = getCartTotal()
  const tax = subtotal * 0.08
  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal + tax + shipping

  return (
    <div className="checkout">
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="checkout-content">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Shipping Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="street">Street Address</label>
                <input type="text" id="street" name="street" value={formData.street} onChange={handleChange} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="zipCode">ZIP Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="place-order-btn" disabled={loading}>
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>

          <div className="order-summary">
            <div className="summary-card">
              <h2>Order Summary</h2>
              <div className="order-items">
                {cartItems.map((item) => (
                  <div key={item.id || item._id} className="order-item">
                    <img
                      src={item.image || "/placeholder.svg?height=60&width=60"}
                      alt={item.name}
                      className="order-item-image"
                    />
                    <div className="order-item-details">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <div className="order-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className="summary-total">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

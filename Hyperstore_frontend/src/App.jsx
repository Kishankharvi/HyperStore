"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, AuthContext } from "./utils/AuthContext"
import { CartProvider } from "./utils/CartContext"
import { useContext } from "react"
import BottomNav from "./components/BottomNav" // Import BottomNav
import Home from "./pages/Home"
import ProductList from "./pages/ProductList"
import ProductDetail from "./pages/ProductDetail"
import AdminDashboard from "./admin/AdminDashboard"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import AuthSuccess from "./pages/AuthSuccess"
import LoadingSpinner from "./components/LoadingSpinner"
import "./styles/App.css"
import Header from "./components/Header"
import { Toaster } from 'react-hot-toast'; // Import Toaster

function AppContent() {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <CartProvider>
      <Router>
        <div className="app">
          <Toaster 
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
          <Header/>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
              <Route path="/auth/success" element={<AuthSuccess />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </Router>
    </CartProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
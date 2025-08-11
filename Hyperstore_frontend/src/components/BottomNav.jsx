import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, User, ShoppingCart } from 'lucide-react';
import '../styles/BottomNav.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className="nav-item" activeclassname="active">
        <Home size={24} />
        <span>Home</span>
      </NavLink>    
      <NavLink to="/products" className="nav-item" activeclassname="active">
        <ShoppingBag size={24} />
        <span>Products</span>
      </NavLink>
      <NavLink to="/cart" className="nav-item" activeclassname="active">
        <ShoppingCart size={24} />
        <span>Cart</span>
      </NavLink>
      <NavLink to="/profile" className="nav-item" activeclassname="active">
        <User size={24} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
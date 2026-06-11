// src/components/Header.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Import logo
import logo from "../assets/images/logo.png";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Load wishlist count
  const loadWishlistCount = () => {
    try {
      const wishlistData = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlistCount(wishlistData.length);
    } catch (error) {
      setWishlistCount(0);
    }
  };

  // Load cart function
  const loadCart = () => {
    try {
      const cartData = JSON.parse(localStorage.getItem("myCart")) || [];
      const fixedCart = cartData.map(item => ({
        ...item,
        quantity: item.quantity ? Number(item.quantity) : 1
      }));
      setCart(fixedCart);
      
      const count = fixedCart.reduce((sum, item) => sum + item.quantity, 0);
      const total = fixedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setCartCount(count);
      setCartTotal(total);
    } catch (error) {
      console.error("Error:", error);
      setCart([]);
    }
  };

  // Load order count
  const loadOrderCount = () => {
    try {
      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      setOrderCount(orders.length);
    } catch (error) {
      console.error("Error loading orders:", error);
      setOrderCount(0);
    }
  };

  // Check login status on component mount and when localStorage changes
  useEffect(() => {
    checkLoginStatus();
    loadCart();
    loadOrderCount();
    loadWishlistCount();
    
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('userLogin', checkLoginStatus);
    window.addEventListener('cartUpdated', loadCart);
    window.addEventListener('orderPlaced', loadOrderCount);
    window.addEventListener('wishlistUpdated', loadWishlistCount);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('userLogin', checkLoginStatus);
      window.removeEventListener('cartUpdated', loadCart);
      window.removeEventListener('orderPlaced', loadOrderCount);
      window.removeEventListener('wishlistUpdated', loadWishlistCount);
    };
  }, []);

  const checkLoginStatus = () => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userData && token) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsLoggedIn(true);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    window.dispatchEvent(new Event('userLogin'));
    navigate('/');
    toast.success("Logged out successfully");
  };

  const getDisplayName = () => {
    if (!user) return 'User';
    return user.username || user.name || user.email?.split('@')[0] || 'User';
  };

  const getFirstLetter = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  // Cart functions
  const removeItem = (id, title) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem("myCart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.error(`${title} removed from cart`);
  };

  const increaseQty = (id) => {
    const updated = cart.map(item =>
      item.id === id
        ? { ...item, quantity: (item.quantity || 1) + 1 }
        : item
    );
    setCart(updated);
    localStorage.setItem("myCart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.info("Quantity increased");
  };

  const decreaseQty = (id) => {
    const updated = cart.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updated);
    localStorage.setItem("myCart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.info("Quantity decreased");
  };

  return (
    <>
      {/* SVG Icons */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
        <defs>
          <symbol xmlns="http://www.w3.org/2000/svg" id="link" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 19a1 1 0 1 0-1-1a1 1 0 0 0 1 1Zm5 0a1 1 0 1 0-1-1a1 1 0 0 0 1 1Zm0-4a1 1 0 1 0-1-1a1 1 0 0 0 1 1Zm-5 0a1 1 0 1 0-1-1a1 1 0 0 0 1 1Zm7-12h-1V2a1 1 0 0 0-2 0v1H8V2a1 1 0 0 0-2 0v1H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3Zm1 17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9h16Zm0-11H4V6a1 1 0 0 1 1-1h1v1a1 1 0 0 0 2 0V5h8v1a1 1 0 0 0 2 0V5h1a1 1 0 0 1 1 1ZM7 15a1 1 0 1 0-1-1a1 1 0 0 0 1 1Zm0 4a1 1 0 1 0-1-1a1 1 0 0 0 1 1Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="arrow-right" viewBox="0 0 24 24">
            <path fill="currentColor" d="M17.92 11.62a1 1 0 0 0-.21-.33l-5-5a1 1 0 0 0-1.42 1.42l3.3 3.29H7a1 1 0 0 0 0 2h7.59l-3.3 3.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l5-5a1 1 0 0 0 .21-.33a1 1 0 0 0 0-.76Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="category" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 5.5h-6.28l-.32-1a3 3 0 0 0-2.84-2H5a3 3 0 0 0-3 3v13a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-10a3 3 0 0 0-3-3Zm1 13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1h4.56a1 1 0 0 1 .95.68l.54 1.64a1 1 0 0 0 .95.68h7a1 1 0 0 1 1 1Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="calendar" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 4h-2V3a1 1 0 0 0-2 0v1H9V3a1 1 0 0 0-2 0v1H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm1 15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7h16Zm0-9H4V7a1 1 0 0 1 1-1h2v1a1 1 0 0 0 2 0V6h6v1a1 1 0 0 0 2 0V6h2a1 1 0 0 1 1 1Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="heart" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20.16 4.61A6.27 6.27 0 0 0 12 4a6.27 6.27 0 0 0-8.16 9.48l7.45 7.45a1 1 0 0 0 1.42 0l7.45-7.45a6.27 6.27 0 0 0 0-8.87Zm-1.41 7.46L12 18.81l-6.75-6.74a4.28 4.28 0 0 1 3-7.3a4.25 4.25 0 0 1 3 1.25a1 1 0 0 0 1.42 0a4.27 4.27 0 0 1 6 6.05Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="plus" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="minus" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 11H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="cart" viewBox="0 0 24 24">
            <path fill="currentColor" d="M8.5 19a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 8.5 19ZM19 16H7a1 1 0 0 1 0-2h8.491a3.013 3.013 0 0 0 2.885-2.176l1.585-5.55A1 1 0 0 0 19 5H6.74a3.007 3.007 0 0 0-2.82-2H3a1 1 0 0 0 0 2h.921a1.005 1.005 0 0 1 .962.725l.155.545v.005l1.641 5.742A3 3 0 0 0 7 18h12a1 1 0 0 0 0-2Zm-1.326-9l-1.22 4.274a1.005 1.005 0 0 1-.963.726H8.754l-.255-.892L7.326 7ZM16.5 19a1.5 1.5 0 1 0 1.5 1.5a1.5 1.5 0 0 0-1.5-1.5Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="check" viewBox="0 0 24 24">
            <path fill="currentColor" d="M18.71 7.21a1 1 0 0 0-1.42 0l-7.45 7.46l-3.13-3.14A1 1 0 1 0 5.29 13l3.84 3.84a1 1 0 0 0 1.42 0l8.16-8.16a1 1 0 0 0 0-1.47Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="trash" viewBox="0 0 24 24">
            <path fill="currentColor" d="M10 18a1 1 0 0 0 1-1v-6a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1ZM20 6h-4V5a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v1H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2ZM10 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm7 14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8h10Zm-3-1a1 1 0 0 0 1-1v-6a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="star-outline" viewBox="0 0 15 15">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M7.5 9.804L5.337 11l.413-2.533L4 6.674l2.418-.37L7.5 4l1.082 2.304l2.418.37l-1.75 1.793L9.663 11L7.5 9.804Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="star-solid" viewBox="0 0 15 15">
            <path fill="currentColor" d="M7.953 3.788a.5.5 0 0 0-.906 0L6.08 5.85l-2.154.33a.5.5 0 0 0-.283.843l1.574 1.613l-.373 2.284a.5.5 0 0 0 .736.518l1.92-1.063l1.921 1.063a.5.5 0 0 0 .736-.519l-.373-2.283l1.574-1.613a.5.5 0 0 0-.283-.844L8.921 5.85l-.968-2.062Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="search" viewBox="0 0 24 24">
            <path fill="currentColor" d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="user" viewBox="0 0 24 24">
            <path fill="currentColor" d="M15.71 12.71a6 6 0 1 0-7.42 0a10 10 0 0 0-6.22 8.18a1 1 0 0 0 2 .22a8 8 0 0 1 15.9 0a1 1 0 0 0 1 .89h.11a1 1 0 0 0 .88-1.1a10 10 0 0 0-6.25-8.19ZM12 12a4 4 0 1 1 4-4a4 4 0 0 1-4 4Z" />
          </symbol>
          <symbol xmlns="http://www.w3.org/2000/svg" id="close" viewBox="0 0 15 15">
            <path fill="currentColor" d="M7.953 3.788a.5.5 0 0 0-.906 0L6.08 5.85l-2.154.33a.5.5 0 0 0-.283.843l1.574 1.613l-.373 2.284a.5.5 0 0 0 .736.518l1.92-1.063l1.921 1.063a.5.5 0 0 0 .736-.519l-.373-2.283l1.574-1.613a.5.5 0 0 0-.283-.844L8.921 5.85l-.968-2.062Z" />
          </symbol>
        </defs>
      </svg>

      {/* Offcanvas Cart - WITH ORDER HISTORY BUTTON */}
      <div
        className="offcanvas offcanvas-end"
        data-bs-scroll="true"
        tabIndex={-1}
        id="offcanvasCart"
        aria-labelledby="My Cart"
      >
        <div className="offcanvas-header justify-content-center">
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body">
          <div className="order-md-last">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-primary">Your cart</span>
              <span className="badge bg-primary rounded-pill">{cartCount}</span>
            </h4>
            {cart.length === 0 ? (
              <div className="text-center py-5">
                <svg width={64} height={64} viewBox="0 0 24 24" className="mb-3 text-muted">
                  <use xlinkHref="#cart" />
                </svg>
                <p className="text-muted">Your cart is empty</p>
                
                {/* Continue Shopping Button */}
                <button 
                  className="btn btn-primary mt-2 me-2"
                  data-bs-dismiss="offcanvas"
                  onClick={() => navigate('/')}
                >
                  Continue Shopping
                </button>
                
                {/* ORDER HISTORY BUTTON - Added here for empty cart */}
                <button 
                  className="btn btn-outline-primary mt-2"
                  data-bs-dismiss="offcanvas"
                  onClick={() => navigate('/orders')}
                >
                   Order History {orderCount > 0 && `(${orderCount})`}
                </button>
              </div>
            ) : (
              <>
                <ul className="list-group mb-3">
                  {cart.map((item) => (
                    <li key={item.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex gap-3">
                          <img
                            src={item.thumbnail || "https://via.placeholder.com/60"}
                            alt={item.title}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "8px"
                            }}
                          />
                          <div>
                            <h6 className="my-0">{item.title}</h6>
                            <small className="text-body-secondary">₹{item.price}</small>
                            <div className="d-flex align-items-center gap-2 mt-2">
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => decreaseQty(item.id)}
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <span className="fw-bold">{item.quantity}</span>
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => increaseQty(item.id)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => removeItem(item.id, item.title)}
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  ))}
                  <li className="list-group-item d-flex justify-content-between">
                    <span className="fw-bold">Total (INR)</span>
                    <strong className="text-primary">₹{cartTotal.toFixed(2)}</strong>
                  </li>
                </ul>
                
                {/* View Cart & Checkout Button */}
                <button 
                  className="w-100 btn btn-primary btn-lg mb-2"
                  onClick={() => {
                    const offcanvas = document.getElementById('offcanvasCart');
                    const bsOffcanvas = window.bootstrap?.Offcanvas?.getInstance(offcanvas);
                    if (bsOffcanvas) bsOffcanvas.hide();
                    navigate('/cart');
                  }}
                >
                   View Cart & Checkout
                </button>
                
                {/* ORDER HISTORY BUTTON - Added here for cart with items */}
                <button 
                  className="w-100 btn btn-outline-primary"
                  data-bs-dismiss="offcanvas"
                  onClick={() => navigate('/orders')}
                >
                   Order History {orderCount > 0 && `(${orderCount})`}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Offcanvas Search */}
      <div
        className="offcanvas offcanvas-end"
        data-bs-scroll="true"
        tabIndex={-1}
        id="offcanvasSearch"
        aria-labelledby="Search"
      >
        <div className="offcanvas-header justify-content-center">
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body">
          <div className="order-md-last">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-primary">Search</span>
            </h4>
            <form
              role="search"
              className="d-flex mt-3 gap-0"
              onSubmit={(e) => {
                e.preventDefault();
                const searchInput = e.target.querySelector('input');
                const searchTerm = searchInput.value;
                if (searchTerm.trim()) {
                  navigate(`/products?search=${searchTerm}`);
                  const offcanvas = document.getElementById('offcanvasSearch');
                  const bsOffcanvas = window.bootstrap?.Offcanvas?.getInstance(offcanvas);
                  if (bsOffcanvas) bsOffcanvas.hide();
                }
              }}
            >
              <input
                className="form-control rounded-start rounded-0 bg-light"
                type="search"
                placeholder="What are you looking for?"
                aria-label="What are you looking for?"
              />
              <button className="btn btn-dark rounded-end rounded-0" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Header */}
      <header>
        <div className="container-fluid">
          {/* Top Header */}
          <div className="row py-3 border-bottom">
            <div className="col-sm-4 col-lg-3 text-center text-sm-start">
              <div className="main-logo">
                <Link to="/">
                  <img src={logo} alt="logo" className="img-fluid" />
                </Link>
              </div>
            </div>
            <div className="col-sm-6 offset-sm-2 offset-md-0 col-lg-5 d-none d-lg-block">
              <form
                className="search-bar row bg-light p-2 my-2 rounded-4 align-items-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  const searchInput = e.target.querySelector('input[type="text"]');
                  const searchTerm = searchInput ? searchInput.value : "";
                  if (searchTerm.trim()) {
                    navigate(`/products?search=${searchTerm}`);
                  }
                }}
              >
                <div className="col-md-4 d-none d-md-block">
                  <select className="form-select border-0 bg-transparent">
                    <option>All Categories</option>
                    <option>Groceries</option>
                    <option>Drinks</option>
                    <option>Chocolates</option>
                  </select>
                </div>
                <div className="col-10 col-md-7">
                  <input
                    type="text"
                    className="form-control border-0 bg-transparent"
                    placeholder="Search for more than 20,000 products"
                  />
                </div>
                <div className="col-2 col-md-1 text-end">
                  <button type="submit" className="border-0 bg-transparent p-0 d-flex align-items-center justify-content-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                    >
                      <use xlinkHref="#search" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
            <div className="col-sm-8 col-lg-4 d-flex justify-content-end gap-5 align-items-center mt-4 mt-sm-0 justify-content-center justify-content-sm-end">
              {/* <div className="support-box text-end d-none d-xl-block">
                <span className="fs-6 text-muted">For Support?</span>
                <h5 className="mb-0">+980-34984089</h5>
              </div> */}
              
              <ul className="d-flex justify-content-end list-unstyled m-0 align-items-center">
                {/* User Profile Section */}
                <li className="position-relative">
                  {isLoggedIn && user ? (
                    <div className="dropdown">
                      <button
                        className="btn btn-link text-decoration-none p-0 border-0 bg-transparent d-flex align-items-center"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <div className="rounded-circle overflow-hidden mx-1" 
                             style={{ 
                               width: '40px', 
                               height: '40px', 
                               border: '2px solid #0d6efd',
                               boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                             }}>
                          {user.image ? (
                            <img 
                              src={user.image} 
                              alt={user.username || 'User'}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `<div class="bg-primary text-white d-flex align-items-center justify-content-center w-100 h-100 fw-bold fs-5">${getFirstLetter()}</div>`;
                              }}
                            />
                          ) : (
                            <div className="bg-primary text-white d-flex align-items-center justify-content-center w-100 h-100 fw-bold fs-5">
                              {getFirstLetter()}
                            </div>
                          )}
                        </div>
                        <span className="ms-2 d-none d-md-inline text-dark fw-medium d-flex align-items-center gap-1">
                          Hi, {getDisplayName()}
                          {user.role === "admin" && (
                            <span className="badge bg-danger ms-1 text-white" style={{ fontSize: "10px", padding: "3px 6px" }}>ADMIN</span>
                          )}
                        </span>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end shadow" style={{ minWidth: '220px' }}>
                        <li>
                          <div className="dropdown-item-text">
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle overflow-hidden me-2" 
                                   style={{ width: '40px', height: '40px' }}>
                                {user.image ? (
                                  <img 
                                    src={user.image} 
                                    alt={user.username}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                ) : (
                                  <div className="bg-primary text-white d-flex align-items-center justify-content-center w-100 h-100 fw-bold">
                                    {getFirstLetter()}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="fw-bold">{getDisplayName()}</div>
                                <small className="text-muted">{user.email || user.username || ''}</small>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        {user.role === "admin" && (
                          <li>
                            <Link to="/admin" className="dropdown-item fw-bold text-primary">
                              <svg width={18} height={18} viewBox="0 0 24 24" className="me-2 text-primary" fill="currentColor">
                                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                              </svg>
                              Admin Dashboard
                            </Link>
                          </li>
                        )}
                        <li>
                          <Link to="/account" className="dropdown-item">
                            <svg width={18} height={18} viewBox="0 0 24 24" className="me-2">
                              <use xlinkHref="#user" />
                            </svg>
                            My Account
                          </Link>
                        </li>
                        <li>
                          <Link to="/orders" className="dropdown-item">
                            <svg width={18} height={18} viewBox="0 0 24 24" className="me-2">
                              <path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 2h5v2h-5V5zm0 4h5v2h-5V9zm-4-2h2v6H8V7zm0 8h2v2H8v-2zm8 2h-5v-2h5v2zm0-4h-5v-2h5v2z"/>
                            </svg>
                            My Orders
                          </Link>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <button 
                            className="dropdown-item text-danger"
                            onClick={handleLogout}
                          >
                            <svg width={18} height={18} viewBox="0 0 24 24" className="me-2">
                              <path fill="currentColor" d="M16 13v-2H7V8l-5 4 5 4v-3h9zM20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"/>
                            </svg>
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <Link to="/login" className="rounded-circle bg-light p-2 mx-1 d-flex align-items-center">
                      <svg width={24} height={24} viewBox="0 0 24 24">
                        <use xlinkHref="#user" />
                      </svg>
                    </Link>
                  )}
                </li>
                
                <li>
                  <Link to="/wishlist" className="rounded-circle bg-light p-2 mx-1 d-flex align-items-center position-relative">
                    <svg width={24} height={24} viewBox="0 0 24 24">
                      <use xlinkHref="#heart" />
                    </svg>
                    {wishlistCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "10px", padding: "4px 6px" }}>
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </li>
                
                <li className="d-lg-none">
                  <a
                    href="#"
                    className="rounded-circle bg-light p-2 mx-1 d-flex align-items-center"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasCart"
                    aria-controls="offcanvasCart"
                  >
                    <svg width={24} height={24} viewBox="0 0 24 24">
                      <use xlinkHref="#cart" />
                    </svg>
                  </a>
                </li>
                
                <li className="d-lg-none">
                  <a
                    href="#"
                    className="rounded-circle bg-light p-2 mx-1 d-flex align-items-center"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasSearch"
                    aria-controls="offcanvasSearch"
                  >
                    <svg width={24} height={24} viewBox="0 0 24 24">
                      <use xlinkHref="#search" />
                    </svg>
                  </a>
                </li>
              </ul>
              
              <div className="cart text-end d-none d-lg-block dropdown">
                <button
                  className="border-0 bg-transparent d-flex flex-column gap-2 lh-1"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasCart"
                  aria-controls="offcanvasCart"
                >
                  <span className="fs-6 text-muted dropdown-toggle">Your Cart</span>
                  <span className="cart-total fs-5 fw-bold">₹{cartTotal.toFixed(2)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="container-fluid">
          <div className="row py-3">
            <div className="d-flex justify-content-center justify-content-sm-between align-items-center">
              <nav className="main-menu d-flex navbar navbar-expand-lg">
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasNavbar"
                  aria-controls="offcanvasNavbar"
                >
                  <span className="navbar-toggler-icon" />
                </button>
                <div
                  className="offcanvas offcanvas-end"
                  tabIndex={-1}
                  id="offcanvasNavbar"
                  aria-labelledby="offcanvasNavbarLabel"
                >
                  <div className="offcanvas-header justify-content-center">
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="offcanvas"
                      aria-label="Close"
                    />
                  </div>
                  <div className="offcanvas-body">
                    <select 
                      className="filter-categories border-0 mb-0 me-5"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "Shop by Departments") {
                          navigate("/products");
                        } else {
                          navigate(`/products?category=${val}`);
                          toast.success(`Filtering by: ${val.replace("-", " ").toUpperCase()} `);
                        }
                      }}
                    >
                      <option>Shop by Departments</option>
                      <option value="groceries">Groceries</option>
                      <option value="drinks">Drinks</option>
                      <option value="chocolates">Chocolates</option>
                      <option value="beauty">Beauty</option>
                      <option value="fragrances">Fragrances</option>
                    </select>
                    <ul className="navbar-nav justify-content-end menu-list list-unstyled d-flex gap-md-3 mb-0">
                      <li className="nav-item active">
                        <Link to="/woman" className="nav-link">
                          Women
                        </Link>
                      </li>
                      <li className="nav-item dropdown">
                        <Link to="/men" className="nav-link">
                          Men
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/kids" className="nav-link">
                          Kids
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/accessories" className="nav-link">
                          Accessories
                        </Link>
                      </li>
                      {/* <li className="nav-item dropdown">
                        <a
                          className="nav-link dropdown-toggle"
                          role="button"
                          id="pages"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          href="#"
                        >
                          Pages
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="pages">
                          <li>
                            <Link to="/about" className="dropdown-item">
                              About Us
                            </Link>
                          </li>
                          <li>
                            <Link to="/shop" className="dropdown-item">
                              Shop
                            </Link>
                          </li>
                          <li>
                            <Link to="/product/1" className="dropdown-item">
                              Single Product
                            </Link>
                          </li>
                          <li>
                            <Link to="/cart" className="dropdown-item">
                              Cart
                            </Link>
                          </li>
                          <li>
                            <Link to="/checkout" className="dropdown-item">
                              Checkout
                            </Link>
                          </li>
                          <li>
                            <Link to="/blog" className="dropdown-item">
                              Blog
                            </Link>
                          </li>
                          <li>
                            <Link to="/styles" className="dropdown-item">
                              Styles
                            </Link>
                          </li>
                          <li>
                            <Link to="/contact" className="dropdown-item">
                              Contact
                            </Link>
                          </li>
                          <li>
                            <Link to="/thank-you" className="dropdown-item">
                              Thank You
                            </Link>
                          </li>
                          <li>
                            <Link to="/account" className="dropdown-item">
                              My Account
                            </Link>
                          </li>
                          <li>
                            <Link to="/orders" className="dropdown-item">
                              My Orders
                            </Link>
                          </li>
                          <li>
                            <Link to="/404" className="dropdown-item">
                              404 Error
                            </Link>
                          </li>
                        </ul>
                      </li> */}
                      <li className="nav-item">
                        <Link to="/brand" className="nav-link">
                          Brand
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/sale" className="nav-link">
                          Sale
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/blog" className="nav-link">
                          Blog
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
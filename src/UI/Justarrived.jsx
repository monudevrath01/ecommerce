import React, { useEffect, useState, useRef } from "react";
import { getProducts } from "../Servise/Products";
import { addToCartAPI } from "../Servise/CartServise";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useNavigate } from "react-router-dom";

// IMPORT IMAGES
import tomato from "../assets/images/thumb-tomatoes.png";
import ketchup from "../assets/images/thumb-tomatoketchup.png";
import banana from "../assets/images/thumb-bananas.png";

const Justarrived = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const [cartData, setCartData] = useState(null);
  const swiperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        console.log("Just arrived products:", data);
        setProducts(data);
        
        // Fetch user cart data
        const userCart = await getUserCart(1);
        if (userCart && userCart.length > 0) {
          setCartData(userCart[0]);
        }
      } catch (err) {
        console.log("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle product click navigation
  const handleProductClick = (productId, e) => {
    e.preventDefault();
    navigate(`/product/${productId}`);
  };

  // Handle add to cart (same as TrendingProducts)
  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    setAddingToCart(prev => ({ ...prev, [product.id]: true }));

    const input = document.getElementById(`quantity-${product.id}`);
    const quantity = input ? parseInt(input.value) : 1;

    try {
      // API CALL (dummy)
      const res = await addToCartAPI(product);
      console.log("API Response:", res);

      // LOCAL STORAGE (REAL CART)
      let cart = JSON.parse(localStorage.getItem("myCart")) || [];

      const exist = cart.find(item => item.id === product.id);

      if (exist) {
        cart = cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        cart.push({
          id: product.id,
          title: product.title || product.name,
          price: product.price,
          thumbnail: product.thumbnail,
          quantity
        });
      }

      localStorage.setItem("myCart", JSON.stringify(cart));

      window.dispatchEvent(new Event("cartUpdated"));

      // TOAST
      toast.success(`${product.title || product.name} added to cart`);

    } catch (error) {
      console.log("API Error:", error);
      toast.error("Failed to add product");
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  // Handle quantity change
  const handleQuantityChange = (productId, change, e) => {
    e.preventDefault();
    e.stopPropagation();
    const quantityInput = document.getElementById(`quantity-${productId}`);
    if (quantityInput) {
      let currentValue = parseInt(quantityInput.value);
      let newValue = currentValue + change;
      if (newValue >= 1) {
        quantityInput.value = newValue;
      }
    }
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    if (!cartData || !cartData.products) return false;
    return cartData.products.some(item => item.id === productId);
  };

  // Get cart quantity for a product
  const getCartQuantity = (productId) => {
    if (!cartData || !cartData.products) return 0;
    const item = cartData.products.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Handle wishlist
  const handleWishlist = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Add to wishlist:", productId);
    // Add your wishlist logic here
  };

  // Product Card Component
  const ProductCard = ({ product, defaultImage }) => (
    <div 
      className="product-item" 
      style={{ 
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: '#fff',
        height: '100%',
        position: 'relative',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onClick={(e) => handleProductClick(product.id, e)}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        e.currentTarget.style.borderColor = 'transparent';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#e5e5e5';
      }}
    >
      {product.discount && (
        <span className="badge bg-success position-absolute" style={{ top: '15px', left: '15px', zIndex: 2 }}>
          -{product.discount}%
        </span>
      )}
      <a 
        href="#" 
        className="btn-wishlist" 
        style={{ position: 'absolute', right: '15px', top: '15px', zIndex: 2 }}
        onClick={(e) => handleWishlist(product.id, e)}
      >
        <svg width={24} height={24}>
          <use xlinkHref="#heart" />
        </svg>
      </a>
      <figure style={{ textAlign: 'center', marginBottom: '15px' }}>
        <a 
          href="#" 
          title={product.title || product.name}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleProductClick(product.id, e);
          }}
        >
          <img 
            src={product.thumbnail || defaultImage || tomato} 
            className="tab-image" 
            alt={product.name}
            style={{ maxWidth: '100%', height: '150px', objectFit: 'contain' }}
          />
        </a>
      </figure>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '5px' }}>
        <a 
          href="#" 
          style={{ textDecoration: 'none', color: 'inherit' }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleProductClick(product.id, e);
          }}
        >
          {product.title || product.name}
        </a>
      </h3>
      <span className="qty" style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
        {product.unit || "1 Unit"}
      </span>
      <span className="rating" style={{ display: 'block', marginBottom: '10px' }}>
        <svg width={18} height={18} className="text-warning" style={{ display: 'inline', marginRight: '5px' }}>
          <use xlinkHref="#star-solid" />
        </svg>
        {product.rating || "4.5"}
        <span className="text-muted ms-1">({product.stock || 50})</span>
      </span>
      <div className="d-flex justify-content-between align-items-center">
        <span className="price fs-5 fw-bold text-primary" style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          display: 'block', 
          marginBottom: '15px' 
        }}>
          ${product.price}
        </span>
        {isInCart(product.id) && (
          <span className="badge bg-info text-white">
            In Cart: {getCartQuantity(product.id)}
          </span>
        )}
      </div>
      <div 
        className="d-flex align-items-center justify-content-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="input-group product-qty" style={{ width: '120px' }}>
          <span className="input-group-btn">
            <button
              type="button"
              className="quantity-left-minus btn btn-outline-secondary btn-number"
              onClick={(e) => handleQuantityChange(product.id, -1, e)}
              disabled={addingToCart[product.id]}
              style={{ padding: '5px 10px' }}
            >
              <svg width={12} height={12}>
                <use xlinkHref="#minus" />
              </svg>
            </button>
          </span>
          <input
            type="text"
            id={`quantity-${product.id}`}
            name="quantity"
            className="form-control input-number text-center"
            defaultValue={1}
            style={{ width: '50px', textAlign: 'center', height: '38px' }}
            disabled={addingToCart[product.id]}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => e.stopPropagation()}
          />
          <span className="input-group-btn">
            <button
              type="button"
              className="quantity-right-plus btn btn-outline-secondary btn-number"
              onClick={(e) => handleQuantityChange(product.id, 1, e)}
              disabled={addingToCart[product.id]}
              style={{ padding: '5px 10px' }}
            >
              <svg width={12} height={12}>
                <use xlinkHref="#plus" />
              </svg>
            </button>
          </span>
        </div>
        <button 
          className="btn btn-primary btn-sm"
          onClick={(e) => handleAddToCart(product, e)}
          disabled={addingToCart[product.id]}
          style={{ minWidth: '110px' }}
        >
          {addingToCart[product.id] ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              Adding...
            </>
          ) : (
            <>
              <svg width={16} height={16} className="me-1" viewBox="0 0 24 24">
                <use xlinkHref="#cart" />
              </svg>
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );

  // Navigation handlers
  const handlePrevSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNextSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-5 overflow-hidden">
        <div className="container-fluid">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Filter just arrived products (you can adjust based on your data)
  const justArrivedProducts = products.filter(product => product.justArrived === true);
  const displayProducts = justArrivedProducts.length > 0 ? justArrivedProducts : products.slice(0, 8);

  // Fallback products if no data from API
  const fallbackProducts = [
    { id: 1, name: "Tomatoes", title: "Tomatoes", price: 18.00, image: tomato, unit: "1 kg", rating: 4.5, stock: 50 },
    { id: 2, name: "Ketchup", title: "Ketchup", price: 15.00, image: ketchup, unit: "500 ml", rating: 4.3, stock: 30 },
    { id: 3, name: "Bananas", title: "Bananas", price: 10.00, image: banana, unit: "1 dozen", rating: 4.7, stock: 100 },
    { id: 4, name: "Bananas", title: "Bananas", price: 10.00, image: banana, unit: "1 dozen", rating: 4.7, stock: 100 },
  ];

  const productsToShow = displayProducts.length > 0 ? displayProducts : fallbackProducts;

  return (
    <section className="py-5 overflow-hidden">
      <div className="container-fluid">
        {/* HEADER */}
        <div className="row">
          <div className="col-md-12">
            <div className="section-header d-flex justify-content-between align-items-center mb-5">
              <h2 className="section-title">Just arrived</h2>

              <div className="d-flex align-items-center">
                <a 
                  href="#" 
                  className="btn-link text-decoration-none me-3"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/products');
                  }}
                >
                  View All Categories →
                </a>

                <div className="swiper-buttons">
                  <button 
                    className="swiper-prev products-carousel-prev btn btn-primary me-2"
                    onClick={handlePrevSlide}
                  >
                    ❮
                  </button>
                  <button 
                    className="swiper-next products-carousel-next btn btn-primary"
                    onClick={handleNextSlide}
                  >
                    ❯
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SLIDER */}
        <div className="row">
          <div className="col-md-12">
            <Swiper
              ref={swiperRef}
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              navigation={false}
              loop={true}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
                1280: {
                  slidesPerView: 5,
                  spaceBetween: 20,
                },
              }}
              className="products-carousel"
            >
              {productsToShow.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard 
                    product={product} 
                    defaultImage={
                      product.name === "Tomatoes" ? tomato :
                      product.name === "Ketchup" ? ketchup :
                      product.name === "Bananas" ? banana : tomato
                    }
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Justarrived;
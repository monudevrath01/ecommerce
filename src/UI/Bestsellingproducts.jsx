import React, { useEffect, useState, useRef } from "react";
import { getProducts } from "../Servise/Products";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useNavigate } from "react-router-dom";
import { addToCartAPI } from "../Servise/CartServise";
import { toast } from "react-toastify";

const Bestsellingproducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const [cartData, setCartData] = useState(null);
  const swiperRef = useRef(null);
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist items from localStorage
  const loadWishlist = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlist(saved);
    } catch (e) {
      setWishlist([]);
    }
  };

  useEffect(() => {
    loadWishlist();
    window.addEventListener("wishlistUpdated", loadWishlist);
    return () => {
      window.removeEventListener("wishlistUpdated", loadWishlist);
    };
  }, []);

  const handleToggleWishlist = (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    let currentWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isExist = currentWishlist.some(item => String(item.id) === String(product.id));

    if (isExist) {
      currentWishlist = currentWishlist.filter(item => String(item.id) !== String(product.id));
      localStorage.setItem("wishlist", JSON.stringify(currentWishlist));
      toast.error(`${product.title} removed from wishlist `);
    } else {
      currentWishlist.push({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        category: product.category,
        stock: product.stock || 50
      });
      localStorage.setItem("wishlist", JSON.stringify(currentWishlist));
      toast.success(`${product.title} added to wishlist! `);
    }
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        console.log("Fetched products:", data);
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
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          quantity
        });
      }

      localStorage.setItem("myCart", JSON.stringify(cart));

      window.dispatchEvent(new Event("cartUpdated"));

      // TOAST
      toast.success(`${product.title} added to cart`);

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

  // Product card component
  const ProductCard = ({ product }) => {
    const inWishlist = wishlist.some(item => String(item.id) === String(product.id));
    return (
      <div 
        className="product-item" 
        style={{ 
          border: '1px solid #eee', 
          padding: '15px', 
          borderRadius: '8px',
          backgroundColor: '#fff',
          height: '100%',
          position: 'relative',
          cursor: 'pointer',
          transition: 'box-shadow 0.3s ease'
        }}
        onClick={(e) => handleProductClick(product.id, e)}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {product.discount && (
          <span className="badge bg-success position-absolute m-3">
            -{product.discount}%
          </span>
        )}
        <a 
          href="#" 
          className="btn-wishlist" 
          style={{ position: 'absolute', right: '15px', top: '15px', zIndex: 5 }}
          onClick={(e) => handleToggleWishlist(product, e)}
        >
          <svg 
            width={20} 
            height={20} 
            fill={inWishlist ? "#e74c3c" : "none"} 
            stroke={inWishlist ? "#e74c3c" : "currentColor"} 
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </a>
      <figure style={{ textAlign: 'center', marginBottom: '15px' }}>
        <a 
          href="#" 
          title={product.title}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleProductClick(product.id, e);
          }}
        >
          <img 
            src={product.thumbnail || "../src/assets/images/thumb-tomatoes.png"} 
            className="tab-image" 
            alt={product.title}
            style={{ maxWidth: '100%', height: '150px', objectFit: 'cover' }}
          />
        </a>
      </figure>
      <h3 style={{ fontSize: '16px', marginBottom: '5px' }}>
        <a 
          href="#" 
          style={{ textDecoration: 'none', color: 'inherit' }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleProductClick(product.id, e);
          }}
        >
          {product.title}
        </a>
      </h3>
      <span className="qty" style={{ display: 'block', color: '#666', fontSize: '14px' }}>{product.unit || "1 Unit"}</span>
      <span className="rating" style={{ display: 'block', marginBottom: '10px' }}>
        <svg width={18} height={18} className="text-warning">
          <use xlinkHref="#star-solid" />
        </svg>{" "}
        {product.rating || "4.5"}
        <span className="text-muted ms-1">({product.stock || 50})</span>
      </span>
      <div className="d-flex justify-content-between align-items-center">
        <span className="price fs-5 fw-bold text-primary">${product.price}</span>
        {isInCart(product.id) && (
          <span className="badge bg-info text-white">
            In Cart: {getCartQuantity(product.id)}
          </span>
        )}
      </div>
      <div className="d-flex align-items-center justify-content-between mt-3">
        <div 
          className="input-group product-qty" 
          style={{ width: '120px' }}
          onClick={(e) => e.stopPropagation()}
        >
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
            style={{ width: '50px' }}
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
  ); };

  // Custom navigation handlers using Swiper instance
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

  if (loading) {
    return (
      <section className="py-5 overflow-hidden">
        <div className="container-fluid">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading best selling products...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  console.log("Products to display:", products);

  if (!products || products.length === 0) {
    return (
      <section className="py-5 overflow-hidden">
        <div className="container-fluid">
          <div className="text-center py-5">No products found</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5 overflow-hidden">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="section-header d-flex flex-wrap justify-content-between my-5">
              <h2 className="section-title">Best selling products</h2>
              <div className="d-flex align-items-center">
                <a 
                  href="#" 
                  className="btn-link text-decoration-none"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/products');
                  }}
                >
                  View All Categories →
                </a>
                <div className="swiper-buttons ms-3">
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
        <div className="row">
          <div className="col-md-12">
            <Swiper
              ref={swiperRef}
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              navigation={false}
              loop={true}
              style={{ padding: '10px 5px' }}
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
              onSwiper={(swiper) => {
                console.log('Swiper initialized:', swiper);
              }}
            >
              {products.slice(0, 10).map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bestsellingproducts;
import React, { useEffect, useState } from "react";
import { getProducts } from "../Servise/Products";
import { useNavigate } from "react-router-dom";
import { addToCartAPI } from "../Servise/CartServise";
import { toast } from "react-toastify";

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [addingToCart, setAddingToCart] = useState({}); 
  const [cartData, setCartData] = useState(null);
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);

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
      toast.success(`${product.title} added to wishlist!`);
    }
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        console.log(data);
        setProducts(data);
        
        
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

  useEffect(() => {
    const handleCategoryFilter = (e) => {
      const selectedCat = e.detail;
      setActiveTab(selectedCat);
      setVisibleCount(10); // Reset count on category change
      
      // Smooth scroll to trending products section
      const element = document.getElementById("trending-products-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("filterCategory", handleCategoryFilter);
    return () => {
      window.removeEventListener("filterCategory", handleCategoryFilter);
    };
  }, []);

  // Filter products based on category
  const getFilteredProducts = (category) => {
    if (category === "all") return products;
    return products.filter(product => product.category === category);
  };

  // Handle tab change
  const handleTabChange = (tabId, e) => {
    e.preventDefault();
    setActiveTab(tabId);
    setVisibleCount(10); // Reset count on tab switch
  };

  // Handle product click navigation
  const handleProductClick = (productId, e) => {
    e.preventDefault();
    navigate(`/product/${productId}`);
  };

  // Handle add to cart
 const handleAddToCart = async (product, e) => {
  e.preventDefault();

  setAddingToCart(prev => ({ ...prev, [product.id]: true }));

  const input = document.getElementById(`quantity-${product.id}`);
  const quantity = input ? parseInt(input.value) : 1;

  try {
    //  API CALL (dummy)
    const res = await addToCartAPI(product);
    console.log("API Response:", res);

    //  LOCAL STORAGE (REAL CART)
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

    //  TOAST
    toast.success(`${product.title} added to cart `);

  } catch (error) {
    console.log("API Error:", error);
    toast.error("Failed to add product ");
  } finally {
    setAddingToCart(prev => ({ ...prev, [product.id]: false }));
  }
};

  // Handle quantity change
  const handleQuantityChange = (productId, change, e) => {
    e.preventDefault();
    const quantityInput = document.getElementById(`quantity-${productId}`);
    if (quantityInput) {
      let currentValue = parseInt(quantityInput.value);
      let newValue = currentValue + change;
      if (newValue >= 1) {
        quantityInput.value = newValue;
      }
    }
  };

  // Check if product is in cart (optional feature)
  const isInCart = (productId) => {
    if (!cartData || !cartData.products) return false;
    return cartData.products.some(item => item.id === productId);
  };

  // Get cart quantity for a product (optional feature)
  const getCartQuantity = (productId) => {
    if (!cartData || !cartData.products) return 0;
    const item = cartData.products.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Product card component
  const ProductCard = ({ product }) => {
    const inWishlist = wishlist.some(item => String(item.id) === String(product.id));
    return (
      <div className="col">
        <div className="product-item position-relative">
          {product.discount && (
            <span className="badge bg-success position-absolute m-3">
              -{product.discount}%
            </span>
          )}
          <a 
            href="#" 
            className="btn-wishlist position-absolute top-0 end-0 m-3"
            onClick={(e) => handleToggleWishlist(product, e)}
            style={{ zIndex: 5 }}
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
        <figure>
          <a 
            href="#" 
            onClick={(e) => handleProductClick(product.id, e)}
            title={product.title}
          >
            <img
              src={product.thumbnail || "../src/assets/images/thumb-bananas.png"}
              className="tab-image w-100"
              alt={product.title}
              style={{ height: '200px', objectFit: 'cover' }}
            />
          </a>
        </figure>
        <h3 className="mt-3">
          <a 
            href="#" 
            onClick={(e) => handleProductClick(product.id, e)}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {product.title}
          </a>
        </h3>
        <span className="qty d-block text-muted">{product.unit || "1 Unit"}</span>
        <span className="rating d-inline-block mb-2">
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
          <div className="input-group product-qty" style={{ width: '120px' }}>
            <span className="input-group-btn">
              <button
                type="button"
                className="quantity-left-minus btn btn-outline-secondary btn-number"
                onClick={(e) => handleQuantityChange(product.id, -1, e)}
                disabled={addingToCart[product.id]}
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
            />
            <span className="input-group-btn">
              <button
                type="button"
                className="quantity-right-plus btn btn-outline-secondary btn-number"
                onClick={(e) => handleQuantityChange(product.id, 1, e)}
                disabled={addingToCart[product.id]}
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
    </div>
  ); };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading products...</span>
          </div>
        </div>
      </div>
    );
  }

  // Get all unique categories present in the products catalog
  const categoriesList = ["all", ...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <div id="trending-products-section" className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="bootstrap-tabs product-tabs">
            <div className="tabs-header d-flex justify-content-between border-bottom my-5 flex-wrap">
              <h3 className="mb-3 mb-md-0">Trending Products</h3>
              <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                  {categoriesList.map(cat => (
                    <a
                      key={cat}
                      href="#"
                      className={`nav-link text-uppercase fs-6 ${activeTab === cat ? 'active' : ''}`}
                      onClick={(e) => handleTabChange(cat, e)}
                      style={{ cursor: "pointer" }}
                    >
                      {cat === "all" ? "All" : cat.replace("-", " ")}
                    </a>
                  ))}
                </div>
              </nav>
            </div>
            <div className="tab-content" id="nav-tabContent">
              <div className="tab-pane fade show active">
                <div className="product-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
                  {getFilteredProducts(activeTab).slice(0, visibleCount).map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {getFilteredProducts(activeTab).length > visibleCount && (
                  <div className="text-center mt-5">
                    <button 
                      className="btn btn-yellow px-5 py-2 fs-6 fw-bold rounded-4 shadow-sm"
                      onClick={() => setVisibleCount(prev => prev + 10)}
                    >
                      See More
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingProducts;
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getProducts } from "../Servise/Products";
import { toast } from "react-toastify";

const ProductsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  
  // Cart state
  const [addingToCart, setAddingToCart] = useState({});

  // Load wishlist
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

  // Fetch all products
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        
        // Get unique categories
        const uniqueCats = [...new Set(data.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCats);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Handle Add to Wishlist
  const handleToggleWishlist = (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    let currentWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isExist = currentWishlist.some(item => String(item.id) === String(product.id));

    if (isExist) {
      currentWishlist = currentWishlist.filter(item => String(item.id) !== String(product.id));
      localStorage.setItem("wishlist", JSON.stringify(currentWishlist));
      toast.error(`${product.title} removed from wishlist 💔`);
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
      toast.success(`${product.title} added to wishlist! ❤️`);
    }
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  // Handle Add to Cart
  const handleAddToCart = (product, e) => {
    e.preventDefault();
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));

    const quantityInput = document.getElementById(`quantity-${product.id}`);
    const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

    try {
      let cart = JSON.parse(localStorage.getItem("myCart")) || [];
      const exist = cart.find(item => item.id === product.id);

      if (exist) {
        cart = cart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
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
      toast.success(`${product.title} added to cart! 🛒`);
    } catch (err) {
      toast.error("Failed to add product to cart");
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  // Handle Quantity Change
  const handleQuantityChange = (productId, change, e) => {
    e.preventDefault();
    const input = document.getElementById(`quantity-${productId}`);
    if (input) {
      const current = parseInt(input.value) || 1;
      const nextVal = current + change;
      if (nextVal >= 1) {
        input.value = nextVal;
      }
    }
  };

  // Filter products based on search and category parameters
  const filteredProducts = products.filter(p => {
    const matchesSearch = searchQuery
      ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
      
    const matchesCategory = categoryQuery
      ? p.category === categoryQuery
      : true;
      
    return matchesSearch && matchesCategory;
  });

  const handleCategorySelect = (categoryName) => {
    if (categoryName === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", categoryName);
    }
    setSearchParams(searchParams);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Catalog...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row g-4">
        
        {/* Product Grid Area */}
        <div className="col-lg-12">
          
          {/* Header section of catalog */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 p-3 bg-light border rounded">
            <div>
              <h4 className="fw-bold mb-0 text-dark">
                {searchQuery ? `Search Results for: "${searchQuery}"` : categoryQuery ? `Category: ${categoryQuery.replace("-", " ").toUpperCase()}` : "Store Catalog"}
              </h4>
              <small className="text-muted">{filteredProducts.length} items found</small>
            </div>
            
            {/* Quick reset tag */}
            {(searchQuery || categoryQuery) && (
              <button 
                className="btn btn-sm btn-outline-danger mt-2 mt-sm-0"
                onClick={() => {
                  setSearchParams({});
                }}
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Catalog Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-5 my-4 bg-white border rounded">
              <h5 className="fw-bold text-dark">No Products Found</h5>
              <p className="text-muted">Try checking your spelling or adjusting your filters.</p>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
              {filteredProducts.map(product => {
                const inWishlist = wishlist.some(item => String(item.id) === String(product.id));
                return (
                  <div key={product.id} className="col">
                    <div className="product-item position-relative">
                      {product.discountPercentage > 0 && (
                        <span className="badge bg-success position-absolute m-3">
                          -{Math.round(product.discountPercentage)}%
                        </span>
                      )}
                      
                      {/* Wishlist Icon Toggle */}
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
                        <Link to={`/product/${product.id}`}>
                          <img
                            src={product.thumbnail}
                            className="tab-image img-fluid"
                            alt={product.title}
                          />
                        </Link>
                      </figure>
                      
                      <h3>
                        <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                          {product.title}
                        </Link>
                      </h3>
                      
                      <span className="qty d-block text-muted">{product.unit || "1 Unit"}</span>
                      
                      <span className="rating d-inline-block mb-2">
                        <svg width={16} height={16} className="text-warning me-1">
                          <use xlinkHref="#star-solid" />
                        </svg>{" "}
                        {product.rating || "4.5"}
                        <span className="text-muted ms-1">({product.stock || 50})</span>
                      </span>

                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="price">₹{product.price}</span>
                      </div>

                      <div className="d-flex align-items-center justify-content-between mt-3">
                        {/* Quantity Pill */}
                        <div className="input-group product-qty">
                          <span className="input-group-btn">
                            <button
                              type="button"
                              className="quantity-left-minus btn btn-number"
                              onClick={(e) => handleQuantityChange(product.id, -1, e)}
                            >
                              <svg width={10} height={10}>
                                <use xlinkHref="#minus" />
                              </svg>
                            </button>
                          </span>
                          <input
                            type="text"
                            id={`quantity-${product.id}`}
                            name="quantity"
                            className="form-control text-center"
                            defaultValue={1}
                            disabled
                          />
                          <span className="input-group-btn">
                            <button
                              type="button"
                              className="quantity-right-plus btn btn-number"
                              onClick={(e) => handleQuantityChange(product.id, 1, e)}
                            >
                              <svg width={10} height={10}>
                                <use xlinkHref="#plus" />
                              </svg>
                            </button>
                          </span>
                        </div>

                        {/* Add to Cart Button */}
                        <button 
                          className="btn btn-primary"
                          onClick={(e) => handleAddToCart(product, e)}
                          disabled={addingToCart[product.id]}
                        >
                          {addingToCart[product.id] ? "..." : "Add to Cart"}
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default ProductsList;

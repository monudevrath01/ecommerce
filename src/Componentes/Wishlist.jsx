import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  // Load wishlist items from localStorage
  const loadWishlist = () => {
    const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(saved);
  };

  useEffect(() => {
    loadWishlist();
    window.addEventListener("wishlistUpdated", loadWishlist);
    return () => {
      window.removeEventListener("wishlistUpdated", loadWishlist);
    };
  }, []);

  // Remove item from wishlist
  const handleRemove = (productId, title) => {
    const updated = wishlist.filter((item) => item.id !== productId);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlistUpdated"));
    toast.error(`${title} removed from wishlist `);
  };

  // Add item from wishlist to cart
  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("myCart")) || [];
    const exist = cart.find((item) => item.id === product.id);

    if (exist) {
      cart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: 1,
      });
    }

    localStorage.setItem("myCart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${product.title} added to cart! 🛒`);
  };

  if (wishlist.length === 0) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="py-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            fill="currentColor"
            className="text-muted mb-4"
            viewBox="0 0 16 16"
          >
            <path d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
          </svg>
          <h3 className="fw-bold text-dark">Your Wishlist is Empty</h3>
          <p className="text-muted mb-4">
            Explore our catalog and click the heart icon on your favorite products.
          </p>
          <Link to="/" className="btn btn-primary px-4 py-2">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
            <h2 className="fw-bold text-dark mb-0"> My Wishlist</h2>
            <span className="badge bg-danger rounded-pill px-3 py-2 fs-6">
              {wishlist.length} Items
            </span>
          </div>

          <div className="card shadow-sm border rounded-3 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">Product</th>
                    <th scope="col">Price</th>
                    <th scope="col">Stock Status</th>
                    <th scope="col" className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {wishlist.map((item) => (
                    <tr key={item.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              backgroundColor: "#f8f9fa",
                            }}
                          />
                          <div>
                            <h6 className="mb-0 fw-bold">
                              <Link
                                to={`/product/${item.id}`}
                                className="text-decoration-none text-dark"
                              >
                                {item.title}
                              </Link>
                            </h6>
                            <small className="text-muted text-capitalize">
                              {item.category}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td className="fw-bold">₹{item.price}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.stock > 0 ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"
                          } px-2.5 py-1.5`}
                        >
                          {item.stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-inline-flex gap-2">
                          <button
                            className="btn btn-primary btn-sm px-3 py-1.5"
                            onClick={() => handleAddToCart(item)}
                            disabled={item.stock <= 0}
                          >
                            Add to Cart
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm px-3 py-1.5"
                            onClick={() => handleRemove(item.id, item.title)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

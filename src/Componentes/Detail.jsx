import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// Optional: your cart API service
// import { addToCartAPI } from "../Servise/CartServise";

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState("");
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Shipping Address State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    streetAddress: "",
    city: "",
    state: ""
  });

  // Prefill address
  useEffect(() => {
    try {
      const savedAddress = JSON.parse(localStorage.getItem("userAddress"));
      if (savedAddress) {
        setAddressForm(savedAddress);
      }
    } catch (e) {
      console.error("Error loading address:", e);
    }
  }, []);

  const validateAddress = () => {
    const { fullName, phone, pincode, streetAddress, city, state } = addressForm;
    if (!fullName.trim() || !phone.trim() || !pincode.trim() || !streetAddress.trim() || !city.trim() || !state.trim()) {
      toast.error("Please fill all address fields!");
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit mobile number!");
      return false;
    }
    if (!/^\d{6}$/.test(pincode)) {
      toast.error("Please enter a valid 6-digit Pincode!");
      return false;
    }
    return true;
  };

  const fetchLocationByPincode = async (pin) => {
    if (!/^\d{6}$/.test(pin)) return;
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await response.json();
      
      if (data && data[0] && data[0].Status === "Success") {
        const postOffice = data[0].PostOffice?.[0];
        if (postOffice) {
          setAddressForm(prev => ({
            ...prev,
            city: postOffice.District || postOffice.Block || "",
            state: postOffice.State || ""
          }));
          toast.success(`Location detected: ${postOffice.District}, ${postOffice.State}`);
        } else {
          toast.error("Location details not found for this pincode.");
        }
      } else {
        toast.error("Invalid Pincode or location not found.");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

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

  const handleToggleWishlist = () => {
    if (!product) return;
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
        thumbnail: product.thumbnail || product.images?.[0],
        category: product.category,
        stock: product.stock || 50
      });
      localStorage.setItem("wishlist", JSON.stringify(currentWishlist));
      toast.success(`${product.title} added to ! `);
    }
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  // Load Cart from localStorage
  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("myCart")) || [];
    setCart(cartData);
  }, []);

  // Fetch Product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Check if this is a custom product from localStorage
        const customProducts = JSON.parse(localStorage.getItem("customProducts")) || [];
        const customProd = customProducts.find(p => String(p.id) === String(id));
        
        if (customProd) {
          setProduct(customProd);
          setActiveImg(customProd.thumbnail || (customProd.images && customProd.images[0]) || "");
          return;
        }

        const res = await axios.get(`https://dummyjson.com/products/${id}`);
        setProduct(res.data);
        setActiveImg(res.data.thumbnail);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProduct();
  }, [id]);

  // Add to Cart
  const handleAddToCart = () => {
    if (!product) return;
    setLoadingBtn(true);

    try {
      let updatedCart = [...cart];
      const exist = updatedCart.find((item) => item.id === product.id);

      if (exist) {
        updatedCart = updatedCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      } else {
        updatedCart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail || product.images?.[0],
          quantity: qty,
        });
      }

      setCart(updatedCart);
      localStorage.setItem("myCart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(`${product.title} added to cart`);
    } catch (err) {
      console.log(err);
      toast.error("Failed to add product");
    } finally {
      setLoadingBtn(false);
    }
  };

  // Open address modal
  const buyNow = (item) => {
    setShowAddressModal(true);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!validateAddress()) return;

    localStorage.setItem("userAddress", JSON.stringify(addressForm));
    setShowAddressModal(false);
    executeRazorpay();
  };

  const executeRazorpay = () => {
    if (!product) return;
    const amount = Math.round(product.price * qty * 100);

    const options = {
      key: "rzp_test_SV1hDaRjChGQ6s",
      amount: amount,
      currency: "INR",
      name: "FoodMart Shop",
      description: product.title,
      handler: function (response) {
        toast.success("Payment Successful");

        const order = {
          id: response.razorpay_payment_id,
          items: [{
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail || product.images?.[0],
            quantity: qty
          }],
          total: product.price * qty,
          date: new Date().toLocaleString(),
          shippingAddress: addressForm,
          status: "Pending"
        };
        const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
        existingOrders.push(order);
        localStorage.setItem("orders", JSON.stringify(existingOrders));
        window.dispatchEvent(new Event("orderPlaced"));
      },
      prefill: {
        name: addressForm.fullName,
        email: "customer@example.com",
        contact: addressForm.phone,
      },
      theme: { color: "#3d9970" },
      method: { card: true, netbanking: true, upi: true },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Razorpay Pay All (Cart Payment)
  // const checkoutAll = () => {
  //   if (cart.length === 0) {
  //     toast.warning("Cart is empty");
  //     return;
  //   }

  //   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  //   const amount = Math.round(total * 100); // paise

  //   const options = {
  //     key: "rzp_test_SV1hDaRjChGQ6s",
  //     amount: amount,
  //     currency: "INR",
  //     name: "My Shop",
  //     description: "Cart Payment",
  //     handler: function (response) {
  //       toast.success("Payment Successful! ID: " + response.razorpay_payment_id);
  //       console.log(response);
  //       localStorage.removeItem("myCart");
  //       setCart([]);
  //       window.dispatchEvent(new Event("cartUpdated"));
  //     },
  //     prefill: {
  //       name: "John Doe",
  //       email: "john@example.com",
  //       contact: "9999999999",
  //     },
  //     theme: { color: "#3399cc" },
  //     method: { card: true, netbanking: true, upi: true },
  //   };

  //   const rzp = new window.Razorpay(options);
  //   rzp.open();
  // };

  if (!product) return <h2 className="text-center mt-5">Loading...</h2>;

  return (
    <div className="container py-5">
      <div className="row">
        {/* Left Side Images */}
        <div className="col-md-6">
          <img
            src={activeImg}
            className="img-fluid rounded mb-3"
            alt={product.title}
          />
          <div className="d-flex gap-2 flex-wrap">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                width="70"
                className="border p-1"
                style={{ cursor: "pointer" }}
                onClick={() => setActiveImg(img)}
                alt=""
              />
            ))}
          </div>
        </div>

        {/* Right Side Details */}
        <div className="col-md-6">
          <h2>{product.title}</h2>
          <h5 className="text-success">{product.discountPercentage}% OFF</h5>
          <h4 className="text-dark">₹ {product.price}</h4>
          <p className="text-muted">{product.description}</p>
          <h6>⭐ Rating: {product.rating}</h6>
          <h6>📦 Stock: {product.stock}</h6>
          <h6>🏷 Brand: {product.brand}</h6>
          <h6>📂 Category: {product.category}</h6>

          {/* Quantity */}
          <div className="d-flex align-items-center gap-3 my-3">
            <button
              className="btn btn-outline-dark"
              onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
            >
              -
            </button>
            <span className="fw-bold">{qty}</span>
            <button className="btn btn-outline-dark" onClick={() => setQty(qty + 1)}>
              +
            </button>
          </div>

          {/* Buttons */}
          <div className="d-flex gap-3">
            <button
              className="btn btn-dark"
              onClick={handleAddToCart}
              disabled={loadingBtn}
            >
              {loadingBtn ? (
                <>
                  <span className="spinner-border spinner-border-sm"></span>
                  Adding...
                </>
              ) : (
                <>Add to Cart</>
              )}
            </button>

            <button className="btn btn-dark" onClick={() => buyNow(product)}>
              Buy Now
            </button>

            <button 
              className={`btn ${wishlist.some(item => String(item.id) === String(product.id)) ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={handleToggleWishlist}
            >
              {wishlist.some(item => String(item.id) === String(product.id)) ? ' In Wishlist' : '🤍 Add to Wishlist'}
            </button>
          </div>

          {/* Cart Pay All */}
          {/* {cart.length > 0 && (
            <button className="btn btn-primary mt-3" onClick={checkoutAll}>
              Pay All (Cart ₹
              {cart.reduce((sum, item) => sum + item.price * item.quantity, 0)})
            </button>
          )} */}
        </div>
      </div>
      {/* Shipping Address Modal */}
      {showAddressModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border rounded shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title fw-bold text-dark">Delivery & Shipping Address</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddressModal(false)}></button>
              </div>
              <form onSubmit={handleAddressSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">FULL NAME *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={addressForm.fullName} 
                      onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })} 
                      placeholder="e.g. Rahul Sharma"
                      required
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label text-muted small fw-bold">MOBILE NUMBER *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={addressForm.phone} 
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} 
                        placeholder="10-digit number"
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-muted small fw-bold">PINCODE *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={addressForm.pincode} 
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, ""); // Only numbers
                          if (val.length <= 6) {
                            setAddressForm({ ...addressForm, pincode: val });
                            if (val.length === 6) {
                              fetchLocationByPincode(val);
                            }
                          }
                        }} 
                        placeholder="6-digit PIN"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">STREET ADDRESS / HOUSE NO. *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={addressForm.streetAddress} 
                      onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })} 
                      placeholder="e.g. Flat No. 104, Green Apartment"
                      required
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label text-muted small fw-bold">CITY *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={addressForm.city} 
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} 
                        placeholder="e.g. New Delhi"
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-muted small fw-bold">STATE *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={addressForm.state} 
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} 
                        placeholder="e.g. Delhi"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAddressModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Proceed to Payment</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
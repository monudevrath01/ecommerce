import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddToCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Shipping Address State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [checkoutTarget, setCheckoutTarget] = useState(null); // { type: "single", item } or { type: "all" }
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

  // Load Cart
  const loadCart = () => {
    try {
      const cartData = JSON.parse(localStorage.getItem("myCart")) || [];

      const fixedCart = cartData.map((item) => ({
        ...item,
        quantity: item.quantity ? Number(item.quantity) : 1,
      }));

      setCart(fixedCart);
    } catch (error) {
      console.error("Error:", error);
      setCart([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, []);

  // Remove Item
  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("myCart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.error("Item removed from cart");
  };

  // Increase Qty
  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: (item.quantity || 1) + 1 }
        : item
    );
    setCart(updated);
    localStorage.setItem("myCart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.info("Quantity increased");
  };

  // Decrease Qty
  const decreaseQty = (id) => {
    const updated = cart.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updated);
    localStorage.setItem("myCart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.info("Quantity decreased");
  };

  // Buy Now (Single Item) - Open address modal
  const buyNow = (item) => {
    setCheckoutTarget({ type: "single", item });
    setShowAddressModal(true);
  };

  // Pay All (Cart Payment) - Open address modal
  const checkoutAll = () => {
    if (cart.length === 0) {
      toast.warning("Cart empty hai");
      return;
    }
    setCheckoutTarget({ type: "all" });
    setShowAddressModal(true);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!validateAddress()) return;

    // Save address for future prefill
    localStorage.setItem("userAddress", JSON.stringify(addressForm));
    setShowAddressModal(false);

    if (checkoutTarget.type === "single") {
      executeRazorpaySingle(checkoutTarget.item);
    } else {
      executeRazorpayAll();
    }
  };

  const executeRazorpaySingle = (item) => {
    const amount = Math.round(item.price * (item.quantity || 1) * 100);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_SV1hDaRjChGQ6s",
      amount,
      currency: "INR",
      name: "FoodMart Shop",
      description: item.title,
      handler: function (response) {
        toast.success("Payment Successful");

        // Save order to history
        const order = {
          id: response.razorpay_payment_id,
          items: [{ ...item, quantity: item.quantity || 1 }],
          total: item.price * (item.quantity || 1),
          date: new Date().toLocaleString(),
          shippingAddress: addressForm,
          status: "Pending"
        };
        const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
        existingOrders.push(order);
        localStorage.setItem("orders", JSON.stringify(existingOrders));
        window.dispatchEvent(new Event("orderPlaced"));

        removeItem(item.id);
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

  const executeRazorpayAll = () => {
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const amount = Math.round(totalAmount * 100);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_SV1hDaRjChGQ6s",
      amount,
      currency: "INR",
      name: "FoodMart Shop",
      description: "Cart Payment",
      handler: function (response) {
        toast.success("Payment Successful");

        // Save cart order to history
        const order = {
          id: response.razorpay_payment_id,
          items: cart,
          total: totalAmount,
          date: new Date().toLocaleString(),
          shippingAddress: addressForm,
          status: "Pending"
        };
        const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
        existingOrders.push(order);
        localStorage.setItem("orders", JSON.stringify(existingOrders));
        window.dispatchEvent(new Event("orderPlaced"));

        // Clear cart
        localStorage.removeItem("myCart");
        setCart([]);
        window.dispatchEvent(new Event("cartUpdated"));
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

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) return <h3 className="text-center mt-5">Loading...</h3>;

  return (
    <div className="container py-5">
      <h2 className="mb-4"> My Cart</h2>

      {cart.length === 0 ? (
        <p>No products in cart</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              className="card mb-3 p-3 d-flex justify-content-between align-items-center flex-row"
            >
              <div className="d-flex align-items-center gap-3">
                <img
                  src={item.thumbnail || item.image || item.images?.[0]}
                  alt={item.title}
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
                <div>
                  <h5>{item.title}</h5>
                  <p>₹ {item.price}</p>
                </div>
              </div>

              <div>
                <button onClick={() => decreaseQty(item.id)}>-</button>
                <span className="mx-2">{item.quantity}</span>
                <button onClick={() => increaseQty(item.id)}>+</button>
              </div>

              <div>
                <button className="btn btn-success me-2" onClick={() => buyNow(item)}>
                  Buy Now
                </button>

                <button className="btn btn-danger" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}

          <hr />
          <h4>Total: ₹ {total}</h4>

          <button className="btn btn-primary mt-3" onClick={checkoutAll}>
            Pay All
          </button>
        </>
      )}
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

export default AddToCart;
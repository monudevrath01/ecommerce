import React, { useEffect, useState } from "react";

const OrdersHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  if (orders.length === 0)
    return (
      <div className="text-center mt-5">
        <h4>No Orders Yet </h4>
        <p className="text-muted">Start shopping to see your orders here.</p>
      </div>
    );

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold text-center">🧾 My Orders</h2>

       {[...orders].reverse().map((order, index) => (   
         <div
          key={order.id}
          className="card mb-4 shadow-sm border-0 rounded-4"
          style={{ overflow: "hidden" }}
        >
          {/* Header */}
          <div className="bg-dark text-white p-3 d-flex justify-content-between">
            <div>
              <h6 className="mb-1">Order #{index + 1}</h6>
              <small>{order.date}</small>
            </div>

            <div className="text-end">
              <small>Payment ID</small>
              <div style={{ fontSize: "12px" }}>{order.id}</div>
            </div>
          </div>

          {/* Items & Shipping Details */}
          <div className="p-3">
            <div className="row g-3">
              {/* Products list */}
              <div className="col-md-7">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex align-items-center gap-3 mb-3 border-bottom pb-3"
                  >
                    {/* Image */}
                    <img
                      src={
                        item.thumbnail ||
                        item.image ||
                        item.images?.[0]
                      }
                      alt={item.title}
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />

                    {/* Info */}
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{item.title}</h6>
                      <small className="text-muted">
                        Qty: {item.quantity || 1}
                      </small>
                    </div>

                    {/* Price */}
                    <div className="fw-bold text-success">
                      ₹ {item.price}
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Info & Address */}
              <div className="col-md-5 border-start-md">
                <div className="bg-light p-3 rounded-3 h-100 border">
                  <h6 className="fw-bold mb-3 text-dark">📍 Delivery & Customer Info</h6>
                  {order.shippingAddress ? (
                    <div>
                      <div className="mb-2">
                        <small className="text-muted d-block text-uppercase fw-semibold mb-1" style={{ fontSize: "10px" }}>Customer Name</small>
                        <span className="fw-bold text-dark fs-6">{order.shippingAddress.fullName}</span>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted d-block text-uppercase fw-semibold mb-1" style={{ fontSize: "10px" }}>Contact Number</small>
                        <span className="text-primary fw-semibold">{order.shippingAddress.phone}</span>
                      </div>
                      <div className="mb-0">
                        <small className="text-muted d-block text-uppercase fw-semibold mb-1" style={{ fontSize: "10px" }}>Shipping Address</small>
                        <p className="text-dark mb-0 small" style={{ lineHeight: "1.4" }}>
                          {order.shippingAddress.streetAddress},<br />
                          {order.shippingAddress.city}, {order.shippingAddress.state} - <strong>{order.shippingAddress.pincode}</strong>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted small">No delivery details recorded for this order.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-light p-3 d-flex justify-content-between align-items-center">
            <span className="fw-semibold">Total Amount</span>
            <span className="fw-bold fs-5 text-success">
              ₹ {order.total}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersHistory;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getProducts } from "../Servise/Products";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Products state
  const [products, setProducts] = useState([]);
  const [customProducts, setCustomProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Orders state
  const [orders, setOrders] = useState([]);
  
  // Modal / Form state for Add/Edit Product
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [editingId, setEditingId] = useState(null);
  
  const [productForm, setProductForm] = useState({
    title: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    thumbnail: "",
    discountPercentage: 0,
    rating: 4.5,
    brand: "My Brand"
  });

  // Verify Admin role on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      toast.error("Access Denied! Admins only.");
      navigate("/login");
    }
  }, [navigate]);

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      // Load products
      const allProds = await getProducts();
      setProducts(allProds);
      
      const savedCustom = JSON.parse(localStorage.getItem("customProducts")) || [];
      setCustomProducts(savedCustom);

      // Load orders
      const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
      setOrders(savedOrders);
    };
    
    loadData();
  }, []);

  // Sync custom products to state & localStorage
  const saveCustomProducts = (updatedList) => {
    setCustomProducts(updatedList);
    localStorage.setItem("customProducts", JSON.stringify(updatedList));
    
    // Refresh combined products list
    getProducts().then(allProds => setProducts(allProds));
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm({ 
      ...productForm, 
      [name]: name === "price" || name === "stock" || name === "discountPercentage" ? Number(value) : value 
    });
  };

  const handleOpenAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setProductForm({
      title: "",
      price: "",
      category: "groceries",
      stock: "50",
      description: "",
      thumbnail: "",
      discountPercentage: 0,
      rating: 4.5,
      brand: "Custom Brand"
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (product) => {
    setModalMode("edit");
    setEditingId(product.id);
    setProductForm({
      title: product.title || "",
      price: product.price || "",
      category: product.category || "groceries",
      stock: product.stock || "50",
      description: product.description || "",
      thumbnail: product.thumbnail || "",
      discountPercentage: product.discountPercentage || 0,
      rating: product.rating || 4.5,
      brand: product.brand || "Custom Brand"
    });
    setShowModal(true);
  };

  const handleSubmitProduct = (e) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price) {
      toast.error("Please fill in required fields.");
      return;
    }

    if (modalMode === "add") {
      const newProduct = {
        ...productForm,
        id: "custom-" + Date.now(),
        thumbnail: productForm.thumbnail || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        images: [productForm.thumbnail || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"]
      };
      
      const updated = [newProduct, ...customProducts];
      saveCustomProducts(updated);
      toast.success("Product added successfully!");
    } else {
      // Edit
      const updated = customProducts.map(p => 
        String(p.id) === String(editingId) ? { ...p, ...productForm } : p
      );
      saveCustomProducts(updated);
      toast.success("Product updated successfully!");
    }

    setShowModal(false);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const isCustom = String(productId).startsWith("custom-");
      if (!isCustom) {
        toast.error("Standard system products cannot be deleted permanently.");
        return;
      }
      
      const updated = customProducts.filter(p => p.id !== productId);
      saveCustomProducts(updated);
      toast.success("Product deleted successfully!");
    }
  };

  // Orders handlers
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    window.dispatchEvent(new Event("orderPlaced")); // Notify changes
    toast.success(`Order status updated to ${newStatus}`);
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Delete this order from history?")) {
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      window.dispatchEvent(new Event("orderPlaced"));
      toast.success("Order history cleared!");
    }
  };

  // Calculations
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalSalesCount = orders.length;
  const productsCount = products.length;
  const categoriesList = [...new Set(products.map(p => p.category))];

  // Filter products for display
  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container py-5">
      
      {/* Header Title Panel */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 p-4 bg-white border rounded shadow-sm">
        <div>
          <h2 className="fw-bold text-dark mb-1">Admin Panel</h2>
          <p className="text-muted mb-0">Manage products inventory catalog and customer order deliveries.</p>
        </div>
        <div className="d-flex gap-2 mt-3 mt-sm-0">
          <button className="btn btn-outline-dark" onClick={() => navigate("/account")}>
            My Account
          </button>
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            + Add Product
          </button>
        </div>
      </div>

      {/* Dashboard Analytics Statistics */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card h-100 shadow-sm p-3 bg-white border">
            <span className="text-muted small fw-semibold text-uppercase">Total Revenue</span>
            <h3 className="fw-bold text-dark mt-2 mb-0">₹{totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card h-100 shadow-sm p-3 bg-white border">
            <span className="text-muted small fw-semibold text-uppercase">Total Orders</span>
            <h3 className="fw-bold text-dark mt-2 mb-0">{totalSalesCount}</h3>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card h-100 shadow-sm p-3 bg-white border">
            <span className="text-muted small fw-semibold text-uppercase">Products</span>
            <h3 className="fw-bold text-dark mt-2 mb-0">{productsCount}</h3>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card h-100 shadow-sm p-3 bg-white border">
            <span className="text-muted small fw-semibold text-uppercase">Categories</span>
            <h3 className="fw-bold text-dark mt-2 mb-0">{categoriesList.length}</h3>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4" style={{ cursor: "pointer" }}>
        <li className="nav-item">
          <span 
            className={`nav-link ${activeTab === "overview" ? "active fw-bold" : "text-muted"}`} 
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </span>
        </li>
        <li className="nav-item">
          <span 
            className={`nav-link ${activeTab === "products" ? "active fw-bold" : "text-muted"}`} 
            onClick={() => setActiveTab("products")}
          >
            Manage Products
          </span>
        </li>
        <li className="nav-item">
          <span 
            className={`nav-link ${activeTab === "orders" ? "active fw-bold" : "text-muted"}`} 
            onClick={() => setActiveTab("orders")}
          >
            Manage Orders ({orders.length})
          </span>
        </li>
      </ul>

      {/* Tab 1: Overview Panel */}
      {activeTab === "overview" && (
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card border shadow-sm p-4 bg-white mb-4 rounded">
              <h5 className="fw-bold mb-3 text-dark">Recent Customer Orders</h5>
              {orders.length === 0 ? (
                <p className="text-muted text-center py-4">No client orders recorded yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...orders].reverse().slice(0, 5).map((order) => (
                        <tr key={order.id}>
                          <td className="small font-monospace">{order.id}</td>
                          <td className="fw-bold text-success">₹{order.total}</td>
                          <td>
                            <span className={`badge bg-${order.status === "Delivered" ? "success" : order.status === "Shipped" ? "info" : order.status === "Cancelled" ? "danger" : "warning"} text-white`}>
                              {order.status || "Pending"}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-light border" onClick={() => setActiveTab("orders")}>
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          <div className="col-lg-5">
            <div className="card border shadow-sm p-4 bg-white rounded">
              <h5 className="fw-bold mb-3 text-dark">Quick Operations</h5>
              <div className="d-grid gap-3">
                <div className="p-3 bg-light rounded d-flex align-items-center justify-content-between border">
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Inventory Items</h6>
                    <small className="text-muted">{customProducts.length} Custom overrides active</small>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={handleOpenAddModal}>
                    Create Product
                  </button>
                </div>
                
                <div className="p-3 bg-light rounded d-flex align-items-center justify-content-between border">
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Reset System Defaults</h6>
                    <small className="text-muted">Clear local storage custom products</small>
                  </div>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => {
                    if (window.confirm("Clear all custom products?")) {
                      saveCustomProducts([]);
                      toast.success("Custom products database cleared!");
                    }
                  }}>
                    Reset Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Manage Products */}
      {activeTab === "products" && (
        <div className="card border shadow-sm p-4 bg-white rounded">
          
          {/* Search and Action Header */}
          <div className="row mb-3 g-3">
            <div className="col-md-8">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search product catalog by title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="col-md-4 text-md-end">
              <button className="btn btn-primary w-100" onClick={handleOpenAddModal}>
                + Add New Product
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Item Info</th>
                  <th>Category</th>
                  <th>Price (INR)</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">No products match your search.</td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const isCustom = String(product.id).startsWith("custom-");
                    return (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img 
                              src={product.thumbnail} 
                              alt={product.title} 
                              style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                            />
                            <div>
                              <h6 className="mb-0 fw-semibold text-dark">{product.title}</h6>
                              <span className={`badge ${isCustom ? "bg-info" : "bg-secondary"} text-white`} style={{ fontSize: "10px" }}>
                                {isCustom ? "Custom" : "API Dummy"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="text-capitalize">{product.category}</td>
                        <td className="fw-bold">₹{product.price}</td>
                        <td>
                          <span className={`fw-medium ${product.stock <= 10 ? "text-danger" : "text-muted"}`}>
                            {product.stock} left
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            {isCustom ? (
                              <>
                                <button className="btn btn-sm btn-outline-primary px-3" onClick={() => handleOpenEditModal(product)}>
                                  Edit
                                </button>
                                <button className="btn btn-sm btn-outline-danger px-3" onClick={() => handleDeleteProduct(product.id)}>
                                  Delete
                                </button>
                              </>
                            ) : (
                              <span className="text-muted small">System Product</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Manage Orders */}
      {activeTab === "orders" && (
        <div className="card border shadow-sm p-4 bg-white rounded">
          <h5 className="fw-bold mb-4 text-dark">Customer Purchase Ledger</h5>
          {orders.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <h4>No Customer Orders Placed Yet</h4>
              <p>Add items to the cart from the store page and place test payments to see transactions populate here.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Order ID & Date</th>
                    <th>Items Detail</th>
                    <th>Customer & Delivery Info</th>
                    <th>Total Amount</th>
                    <th>Status Controls</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...orders].reverse().map((order) => (
                    <tr key={order.id}>
                      <td>
                        <div className="fw-bold small font-monospace">{order.id}</div>
                        <div className="text-muted small mt-1">{order.date}</div>
                      </td>
                      <td>
                        <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                          {order.items.map((item, index) => (
                            <div key={index} className="d-flex align-items-center gap-2 mb-2 pb-1 border-bottom">
                              <img src={item.thumbnail} alt={item.title} style={{ width: "30px", height: "30px", objectFit: "cover", borderRadius: "4px" }} />
                              <span className="small text-dark flex-grow-1" style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {item.title}
                              </span>
                              <span className="badge bg-light text-dark border">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        {order.shippingAddress ? (
                          <div className="small">
                            <div className="fw-bold text-dark">{order.shippingAddress.fullName}</div>
                            <div className="text-primary fw-medium mb-1">{order.shippingAddress.phone}</div>
                            <div className="text-muted text-wrap" style={{ maxWidth: "250px", fontSize: "12px", lineHeight: "1.3" }}>
                              {order.shippingAddress.streetAddress}, {order.shippingAddress.city}, {order.shippingAddress.state} - <strong>{order.shippingAddress.pincode}</strong>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted small">No address provided</span>
                        )}
                      </td>
                      <td className="fw-bold text-success fs-5">₹{order.total}</td>
                      <td>
                        <select 
                          className="form-select form-select-sm fw-semibold"
                          value={order.status || "Pending"}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          style={{
                            color: order.status === "Delivered" ? "#198754" : order.status === "Shipped" ? "#0dcaf0" : order.status === "Cancelled" ? "#dc3545" : "#ffc107"
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteOrder(order.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border rounded shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title fw-bold text-dark">
                  {modalMode === "add" ? "Create New Product" : "Modify Product"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmitProduct}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">PRODUCT NAME *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="title" 
                      value={productForm.title} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Fresh Red Apples"
                      required
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label text-muted small fw-bold">PRICE (INR) *</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="price" 
                        value={productForm.price} 
                        onChange={handleInputChange} 
                        placeholder="₹"
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-muted small fw-bold">IN STOCK QTY</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="stock" 
                        value={productForm.stock} 
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label text-muted small fw-bold">CATEGORY</label>
                      <select className="form-select text-capitalize" name="category" value={productForm.category} onChange={handleInputChange}>
                        <option value="groceries">Groceries</option>
                        <option value="drinks">Drinks</option>
                        <option value="chocolates">Chocolates</option>
                        <option value="beauty">Beauty</option>
                        <option value="fragrances">Fragrances</option>
                        <option value="mens-shirts">Men's Shirts</option>
                        <option value="mens-shoes">Men's Shoes</option>
                        <option value="womens-dresses">Women's Dresses</option>
                        <option value="womens-shoes">Women's Shoes</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label text-muted small fw-bold">DISCOUNT %</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="discountPercentage" 
                        value={productForm.discountPercentage} 
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">IMAGE URL</label>
                    <input 
                      type="url" 
                      className="form-control" 
                      name="thumbnail" 
                      value={productForm.thumbnail} 
                      onChange={handleInputChange} 
                      placeholder="https://example.com/product.jpg"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">PRODUCT DESCRIPTION</label>
                    <textarea 
                      className="form-control" 
                      name="description" 
                      rows="3" 
                      value={productForm.description} 
                      onChange={handleInputChange}
                      placeholder="Product specifications..."
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

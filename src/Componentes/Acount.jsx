// src/Componentes/Account.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Account = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh", padding: "40px 0" }}>
      <div className="container">
        <div className="row justify-content-center">

          <div className="col-lg-8">

            <div
              className="card shadow-lg border-0"
              style={{ borderRadius: "20px", overflow: "hidden" }}
            >

              {/*  Header */}
              <div
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  padding: "40px",
                  textAlign: "center",
                  color: "#fff",
                }}
              >
                <img
                  src={user.image || "https://via.placeholder.com/100"}
                  alt="user"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "5px solid white",
                    marginBottom: "15px",
                  }}
                />

                <h2 className="mb-1">
                  {user.firstName || "User"} {user.lastName}
                </h2>
                <p>{user.username}</p>
              </div>

              {/*  Body */}
              <div className="card-body p-4">

                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Email</strong>
                  </div>
                  <div className="col-md-6 text-end">
                    {user.email || "N/A"}
                  </div>
                </div>

                <hr />

                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Gender</strong>
                  </div>
                  <div className="col-md-6 text-end">
                    {user.gender || "N/A"}
                  </div>
                </div>

                <hr />

                <div className="row mb-3 align-items-center">
                  <div className="col-md-6">
                    <strong>User Role</strong>
                  </div>
                  <div className="col-md-6 text-end">
                    <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-secondary'} px-3 py-2 fs-6`}>
                      {user.role === 'admin' ? 'Admin' : 'Customer'}
                    </span>
                  </div>
                </div>

                {/* Admin Action Box */}
                {user.role === 'admin' && (
                  <div className="mt-4 p-4 rounded shadow-sm text-center bg-light border">
                    <h5 className="fw-bold text-dark mb-2"> Admin Status</h5>
                    <p className="small text-muted mb-3">You have access to add products, modify stock levels, and monitor customer orders.</p>
                    <button 
                      className="btn btn-primary w-100 py-2 fw-semibold"
                      onClick={() => navigate('/admin')}
                    >
                      Go to Admin Dashboard
                    </button>
                  </div>
                )}

                {/*  Buttons */}
                <div className="d-flex justify-content-between mt-4">
                  <button
                    className="btn btn-dark px-4 py-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Account;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../Servise/LoginServise";
import { toast } from "react-toastify";


const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    image: "",
  });

  const navigate = useNavigate();

  // input handle
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🖼 image handle
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
    };

    reader.readAsDataURL(file);
  };

  //  login (API + image merge)
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      let finalUser;
      let token;

      if (form.username.trim().toLowerCase() === "admin" && form.password.trim() === "admin") {
        // Mock Admin Login
        finalUser = {
          id: 9999,
          username: "admin",
          firstName: "Admin",
          lastName: "User",
          email: "admin@myshop.com",
          gender: "male",
          role: "admin",
          image: form.image || "https://img.icons8.com/color/150/000000/administrator-male.png"
        };
        token = "mock-admin-token-123456";
      } else {
        // API call
        const data = await loginUser({
          username: form.username,
          password: form.password,
        });

        //  merge API data + image
        finalUser = {
          ...data,
          role: "user",
          image: form.image || data.image, // user image override
        };
        token = data.accessToken;
      }

      localStorage.setItem("user", JSON.stringify(finalUser));
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("userLogin"));

      toast.success("Login Successful ");    
      navigate("/account");

    } catch (error) {
      alert("Login Failed ");
    }
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#9A616D" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">

                {/* Image */}
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                    alt="login"
                    className="img-fluid"
                  />
                </div>

                {/* Form */}
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">

                    <form onSubmit={handleLogin}>
                      <h3 className="mb-3">Login</h3>

                      {/* Username */}
                      <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="form-control mb-3"
                        value={form.username}
                        onChange={handleChange}
                        required
                      />

                      {/* Password */}
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="form-control mb-3"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />

                      {/* 🖼 Image Upload */}
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control mb-3"
                        onChange={handleImage}
                      />

                      {/* Preview */}
                      {form.image && (
                        <img
                          src={form.image}
                          alt="preview"
                          style={{
                            width: "80px",
                            borderRadius: "50%",
                            marginBottom: "10px",
                          }}
                        />
                      )}

                      <button className="btn btn-dark w-100 mb-3" type="submit">
                        Login
                      </button>

                  
                    </form>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
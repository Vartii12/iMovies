import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { BASE_URL } from "../../hooks/useFetch";
import "../login/style.scss";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/admin/register`, formData);
      if (res.data.success) {
        Cookies.set("adminToken", res.data.token, { expires: 7 });
        localStorage.setItem("adminToken", res.data.token);
        localStorage.setItem("adminEmail", res.data.admin.email);
        toast.success("Admin registered successfully!");
        navigate("/admin");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Admin registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Header />
      <div className="auth-card-container">
        <div className="auth-card">
          <h2>Register Administrator</h2>
          <p className="subtitle">Create privileged account to manage theatres, movies, and shows</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Admin Username</label>
              <input
                type="text"
                name="username"
                placeholder="admin_root"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="admin@imovies.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Min 8 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>

            <button type="submit" className="submit-btn" style={{ background: "#f59e0b" }} disabled={loading}>
              {loading ? "Registering..." : "Create Admin Account"}
            </button>
          </form>

          <div className="auth-footer">
            Already registered? <Link to="/admin/login">Admin Login</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminRegister;

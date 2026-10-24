import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { BASE_URL } from "../../hooks/useFetch";
import "../login/style.scss";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/admin/login`, formData);
      if (res.data.success) {
        Cookies.set("adminToken", res.data.token, { expires: 7 });
        localStorage.setItem("adminToken", res.data.token);
        localStorage.setItem("adminEmail", res.data.admin.email);
        toast.success("Welcome Admin!");
        navigate("/admin");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid Admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Header />
      <div className="auth-card-container">
        <div className="auth-card">
          <h2>Admin Portal</h2>
          <p className="subtitle">Sign in with Cinema Administrator credentials</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Admin Email</label>
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
                placeholder="Admin password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn" style={{ background: "#f59e0b" }} disabled={loading}>
              {loading ? "Authenticating..." : "Admin Sign In"}
            </button>
          </form>

          <div className="auth-footer">
            Need an admin account? <Link to="/admin/register">Register Admin</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLogin;

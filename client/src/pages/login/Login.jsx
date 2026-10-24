import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { BASE_URL } from "../../hooks/useFetch";
import "./style.scss";

const Login = () => {
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
      const res = await axios.post(`${BASE_URL}/api/auth/login`, formData);
      if (res.data.success) {
        Cookies.set("userToken", res.data.token, { expires: 7 });
        localStorage.setItem("userToken", res.data.token);
        localStorage.setItem("username", res.data.user.username);
        localStorage.setItem("userEmail", res.data.user.email);
        toast.success("Welcome back to iMovies!");
        navigate("/home");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Header />
      <div className="auth-card-container">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to book tickets and manage reservations</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </div>
          <div className="admin-switch">
            Staff or Cinema Admin? <Link to="/admin/login">Admin Portal</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

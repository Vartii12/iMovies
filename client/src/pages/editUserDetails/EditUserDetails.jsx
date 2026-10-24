import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../hooks/useFetch";
import Cookies from "js-cookie";
import "../login/style.scss";

const EditUserDetails = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = Cookies.get("userToken") || localStorage.getItem("userToken");
    try {
      const res = await axios.put(
        `${BASE_URL}/api/auth/update`,
        { username },
        { headers: { "auth-token": token } }
      );
      if (res.data.success) {
        localStorage.setItem("username", username);
        toast.success("Profile updated successfully!");
        navigate("/profile");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Header />
      <div className="auth-card-container">
        <div className="auth-card">
          <h2>Edit User Details</h2>
          <p className="subtitle">Update your profile display settings</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Display Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditUserDetails;

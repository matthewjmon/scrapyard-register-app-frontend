import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api"; // <-- use your api.js instance with correct baseURL

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use the api instance, not default axios
      const res = await api.post("/auth/login", { email, password });

      // Save all relevant user info in localStorage
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          token: res.data.token,
          username: res.data.username,
          email: res.data.email,
          businessName: res.data.businessName || "",
        })
      );

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="d-grid mb-3">
            <button type="submit" className="btn btn-dark">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

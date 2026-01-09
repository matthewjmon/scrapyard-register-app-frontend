// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Navbar.css"; // Optional for extra custom styles

export default function Navbar() {
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState(
    localStorage.getItem("businessName") || "Your Business"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(businessName);

  useEffect(() => {
    // Ensure localStorage is in sync on mount
    localStorage.setItem("businessName", businessName);
  }, [businessName]);

  const saveBusinessName = () => {
    if (tempName.trim() === "") return; // Don't allow empty name
    setBusinessName(tempName.trim());
    localStorage.setItem("businessName", tempName.trim());
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <div className="container-fluid d-flex align-items-center justify-content-between">

        {/* Business Name */}
        <div className="d-flex align-items-center">
          {isEditing ? (
            <div className="d-flex align-items-center gap-2">
              <input
                type="text"
                className="form-control form-control-sm"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveBusinessName()}
                autoFocus
              />
              <button
                className="btn btn-sm btn-info text-dark"
                onClick={saveBusinessName}
              >
                Save
              </button>
              <button
                className="btn btn-sm btn-info text-dark"
                onClick={() => {
                  setTempName(businessName);
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-1">
              <span className="navbar-brand mb-0 h1">{businessName}</span>
              <button
                className="btn btn-sm text-light p-1"
                title="Edit Business Name"
                onClick={() => setIsEditing(true)}
              >
                <i className="bi bi-pencil"></i>
              </button>
            </div>
          )}
        </div>

        {/* Logout */}
        <div>
          <button className="btn btn-outline-light d-flex align-items-center gap-1" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

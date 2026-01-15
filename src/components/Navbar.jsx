import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateBusinessName } from "../api";
import "../Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [businessName, setBusinessName] = useState(
    userInfo?.businessName || "Your Business"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(businessName);

  const saveBusinessName = async () => {
    const trimmedName = tempName.trim();
    if (!trimmedName) return;

    try {
      // Update DB
      await updateBusinessName(trimmedName);

      // Update state
      setBusinessName(trimmedName);
      setIsEditing(false);

      // Update localStorage (single source of truth)
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          ...userInfo,
          businessName: trimmedName,
        })
      );
    } catch (err) {
      console.error("Failed to update business name:", err);
      alert("Failed to save business name.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">

        {/* Business Name */}
        <div>
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
              <button className="btn btn-sm btn-info" onClick={saveBusinessName}>
                Save
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  setTempName(businessName);
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <span className="navbar-brand mb-0 h1">{businessName}</span>
              <button
                className="btn btn-sm text-light"
                onClick={() => setIsEditing(true)}
              >
                <i className="bi bi-pencil"></i>
              </button>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          className="btn btn-outline-light"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

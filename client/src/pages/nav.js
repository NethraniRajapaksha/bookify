import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/nav.css";

function Nav() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [userData, setUserData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  // Handle Input Changes
  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle User Registration
  const handleSignup = async () => {
    const response = await fetch("http://localhost:8800/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message); 
      setIsSignInOpen(false); // Close modal on success
    } else {
      alert(data.error); // Display error message
    }
  };

  // Handle User Login
  const handleLogin = async () => {
    const response = await fetch("http://localhost:8800/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userData.email, password: userData.password }),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      alert("Login Successful!");
      // Store token and user data in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ email: userData.email })); // Save email here
      setIsLoginOpen(false); // Close modal
      navigate("/slots"); // Navigate to Appointment Page
    } else {
      alert(data.error || "Login failed. Please check your credentials.");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Remove user data on logout
    alert("Logged out successfully");
    navigate("/"); // Navigate to home page
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-logo">Bookify</h1>

          <div className="navbar-buttons">
            <button className="navbar-btn login-btn" onClick={() => setIsLoginOpen(true)}>
              Login
            </button>
            <button className="navbar-btn signin-btn" onClick={() => setIsSignInOpen(true)}>
              Sign Up
            </button>
            <button className="navbar-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      {/* Login Popup */}
      {isLoginOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Login</h2>
            <input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
            <input type="password" name="password" placeholder="Password" onChange={handleInputChange} />
            <div className="modal-buttons">
              <button className="submit-btn" onClick={handleLogin}>Login</button>
              <button className="close-btn" onClick={() => setIsLoginOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Up Popup */}
      {isSignInOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Sign Up</h2>
            <input type="text" name="username" placeholder="Username" onChange={handleInputChange} />
            <input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
            <input type="password" name="password" placeholder="Password" onChange={handleInputChange} />
            <div className="modal-buttons">
              <button className="submit-btn" onClick={handleSignup}>Sign Up</button>
              <button className="close-btn" onClick={() => setIsSignInOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Nav;

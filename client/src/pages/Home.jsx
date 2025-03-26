import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-wrapper">
      <div className="home-card">
        <h1>Welcome to Meal Planner</h1>
        <p style={{ marginBottom: "2rem", color: "#555" }}>Plan smarter. Eat better.</p>
        <div className="home-buttons">
          <Link to="/login" className="home-btn login-btn">Log In</Link>
          <Link to="/signup" className="home-btn signup-btn">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

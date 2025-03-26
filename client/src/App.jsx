import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateMeal from "./pages/CreateMeal";
import EditMeal from "./pages/EditMeal";
import { AuthProvider } from "./context/AuthContext";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateMeal />} />
          <Route path="/edit/:mealId" element={<EditMeal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;

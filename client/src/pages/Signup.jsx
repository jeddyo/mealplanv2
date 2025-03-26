import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { AuthContext } from "../context/AuthContext";

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [signupMutation] = useMutation(SIGNUP_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await signupMutation({
        variables: { username, email, password },
      });

      if (data?.signup?.token) {
        login(data.signup.token);
        navigate("/dashboard");
      }
    } catch (error) {
      setErrorMsg("Signup failed: " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Username</label>
        <input
          type="text"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="signup">Sign Up</button>

        {errorMsg && <p style={{ color: "red", marginTop: "0.75rem" }}>{errorMsg}</p>}
      </form>
    </div>
  );
};

export default Signup;

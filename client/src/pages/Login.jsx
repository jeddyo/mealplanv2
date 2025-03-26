import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { AuthContext } from "../context/AuthContext";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });

      if (data?.login?.token) {
        login(data.login.token);
        navigate("/dashboard");
      }
    } catch (error) {
      setErrorMsg("Login failed: " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>
      <form onSubmit={handleSubmit} className="auth-form">
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

        <button type="submit" className="login">Log In</button>

        {errorMsg && <p style={{ color: "red", marginTop: "0.75rem" }}>{errorMsg}</p>}
      </form>
    </div>
  );
};

export default Login;

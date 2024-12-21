import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Retrieve the users array from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if a user with the entered email and password exists
    const user = users.find(
      (u) => u.email === loginData.email && u.password === loginData.password
    );

    if (user) {
      // Create a session for the user
      sessionStorage.setItem("loggedInUser", JSON.stringify(user));

      // Call onLogin to update App.js state
      onLogin();

      // Navigate to the Dashboard
      alert("Login successful!");
      navigate("/dashboard");
    } else {
      alert("Incorrect credentials!");
    }
  };

  return (
    <div style={{width:'100%', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={styles.card}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={loginData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={loginData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
      <p>
        Don't have an account?{" "}
        <button onClick={() => navigate("/signup")} style={styles.linkButton}>
          Create Account
        </button>
      </p>
    </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    width: "400px",
  },
  inputGroup: {
    marginBottom: "15px",
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
  },
  button: {
    backgroundColor: "#007BFF",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
  },
  linkButton: {
    background: "none",
    color: "#007BFF",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Login;
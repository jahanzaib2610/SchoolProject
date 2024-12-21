import React, { useState, useEffect } from "react";

function Dashboard({ onLogout }) {
  const [schoolData, setSchoolData] = useState({
    schoolName: "",
    address: "",
    email: "",
  });
  const [user, setUser] = useState(null);
  const [schools, setSchools] = useState([]); // To store the current user's schools
  const [allSchools, setAllSchools] = useState([]); // To store all schools for admin users

  useEffect(() => {
    // Retrieve the logged-in user from sessionStorage
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

    if (loggedInUser) {
      setUser(loggedInUser);
      setSchools(loggedInUser.schools || []); // Load schools if they exist
      // If the logged-in user is an admin, fetch all schools from localStorage
      if (loggedInUser.role === "admin") {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const allUserSchools = users.flatMap((u) => u.schools || []);
        setAllSchools(allUserSchools); // Store all schools for admin to see
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchoolData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert("User not logged in.");
      return;
    }

    // Retrieve all users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find and update the logged-in user's object
    const updatedUsers = users.map((u) => {
      if (u.email === user.email) {
        const updatedUser = {
          ...u,
          schools: [...(u.schools || []), schoolData], // Add the new school
        };

        // Update the session storage for the logged-in user
        sessionStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

        // Update the state with the new schools list
        setSchools(updatedUser.schools);

        return updatedUser;
      }
      return u;
    });

    // Save the updated users array to localStorage
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // For admin, update the `allSchools` state with the latest schools
    if (user.role === "admin") {
      const allUserSchools = updatedUsers.flatMap((u) => u.schools || []);
      setAllSchools(allUserSchools);
    }
    // Reset the school form
    setSchoolData({ schoolName: "", address: "", email: "" });

    alert("School information added successfully!");
  };

  return (
    <div style={styles.container}>
      <h1>Welcome, {user?.username || "User"}!</h1>
      <button onClick={onLogout} style={styles.logoutButton}>
        Logout
      </button>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Add School Information</h2>
        <div style={styles.inputGroup}>
          <label>School Name:</label>
          <input
            type="text"
            name="schoolName"
            placeholder="Enter School name"
            value={schoolData.schoolName}
            onChange={handleChange}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            placeholder="Enter School address"
            value={schoolData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter School email"
            value={schoolData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" style={styles.button}>
          Add School
        </button>
      </form>

      {/* Render school cards */}
      <div style={styles.schoolContainer}>
        <h2>
          {user?.role === "admin"
            ? "All Registered Schools"
            : "Your Registered Schools"}
        </h2>
        {(user?.role === "admin" ? allSchools : schools).length > 0 ? (
          (user?.role === "admin" ? allSchools : schools).map(
            (school, index) => (
              <div key={index} style={styles.card}>
                <h3>{school.schoolName}</h3>
                <p>
                  <strong>Address:</strong> {school.address}
                </p>
                <p>
                  <strong>Email:</strong> {school.email}
                </p>
              </div>
            )
          )
        ) : (
          <p>No schools registered yet.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
  },
  logoutButton: {
    backgroundColor: "#FF5733",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  form: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    width: "100%",
    maxWidth: "400px",
    marginBottom: "20px",
  },
  inputGroup: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
  schoolContainer: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "8px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  },
};

export default Dashboard;

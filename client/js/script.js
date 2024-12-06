document
  .getElementById("registrationForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get form values
    const fullName = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Check for valid email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Password complexity check (at least one uppercase, one lowercase, one number, one special char)
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      alert(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    // Prepare the request body to match server expectations
    const userData = {
      fullName: fullName, // Changed from 'name' to 'fullName'
      email: email,
      password: password,
      confirmPassword: confirmPassword, // Added confirmPassword
    };

    // Send registration data to the API
    try {
      const response = await fetch("http://localhost:8107/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        window.location.href = "client/login.html"; // Redirect to login page after successful registration
      } else {
        alert("Error: " + data.message || "Registration failed");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  });

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get form values
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    // Check if the email and password are not empty
    if (!email || !password) {
      alert("Both email and password are required!");
      return;
    }

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Prepare the login request body
    const loginData = {
      email: email,
      password: password,
    };

    // Send login data to the API
    try {
      const response = await fetch("http://localhost:8107/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token in localStorage
        localStorage.setItem("authToken", data.token);

        alert("Login successful!");
        // Redirect to the dashboard or home page
        window.location.href = "dashboard.html";
      } else {
        alert("Error: " + data.message || "Login failed");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  });

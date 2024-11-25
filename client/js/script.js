// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // **Login Form Handling**
    const loginForm = document.getElementById("loginForm");
  
    if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the form from being submitted normally
  
        // Get form values
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
  
        // Validate email format
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(email)) {
          alert("Please enter a valid email address");
          return;
        }
  
        // Validate password
        if (password.trim() === "") {
          alert("Please enter your password");
          return;
        }
  
        // Create FormData to send via AJAX
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
  
        // Send AJAX request to login.php
        fetch("php/login.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              // Redirect to dashboard or another page on success
              window.location.href = "dashboard.html";
            } else {
              // Show error message from the server
              alert(data.message);
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred. Please try again later.");
          });
      });
    }
  
    // **Registration Form Handling**
    const registrationForm = document.getElementById("registrationForm");
  
    if (registrationForm) {
      registrationForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the form from being submitted normally
  
        // Get form values
        const name = document.getElementById("regName").value;
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
  
        // Validate password and confirm password match
        if (password !== confirmPassword) {
          alert("Passwords do not match!");
          return;
        }
  
        // Validate all required fields are filled
        if (name.trim() === "" || email.trim() === "" || password.trim() === "" || confirmPassword.trim() === "") {
          alert("Please fill in all fields.");
          return;
        }
  
        // Create FormData to send via AJAX
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("confirm_password", confirmPassword);
  
        // Send AJAX request to register.php
        fetch("php/register.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              alert(data.message); // Optional: Show success message
              window.location.href = "login.html"; // Redirect to login page
            } else {
              alert(data.message); // Show error message
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred. Please try again later.");
          });
      });
    }
  });
  
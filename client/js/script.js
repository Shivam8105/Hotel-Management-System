document.addEventListener("DOMContentLoaded", function () {
  // Login Form Handler
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Get form elements
      const emailInput = document.getElementById("loginEmail");
      const passwordInput = document.getElementById("loginPassword");

      // Get form values
      const email = emailInput.value.trim();
      const password = passwordInput.value;

      // Validate inputs
      let isValid = true;

      // Email validation
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!email || !emailPattern.test(email)) {
        emailInput.setCustomValidity("Please enter a valid email address");
        isValid = false;
      } else {
        emailInput.setCustomValidity("");
      }

      // Password validation
      if (!password) {
        passwordInput.setCustomValidity("Password is required");
        isValid = false;
      } else {
        passwordInput.setCustomValidity("");
      }

      // Trigger validation display
      loginForm.reportValidity();

      // If any validation fails, stop submission
      if (!isValid) {
        return;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      // Send login request
      fetch("php/login.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          console.log("Raw Response:", response);
          return response.json();
        })
        .then((data) => {
          console.log("Login Response:", data);

          if (data.success) {
            // Redirect to dashboard
            window.location.href = "dashboard.html";
          } else {
            alert(data.message || "Login failed. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Login Error:", error);
          alert("Login failed. " + error.message);
        });
    });
  }
  // Registration Form Handler
  const registrationForm = document.getElementById("registrationForm");
  if (registrationForm) {
    registrationForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Get form elements
      const nameInput = document.getElementById("regName");
      const emailInput = document.getElementById("regEmail");
      const passwordInput = document.getElementById("regPassword");
      const confirmPasswordInput = document.getElementById("confirmPassword");

      // Get form values
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      // Validate each input individually
      let isValid = true;

      // Name validation
      if (
        !name ||
        name.length < 2 ||
        name.length > 50 ||
        !/^[a-zA-Z\s'-]+$/.test(name)
      ) {
        nameInput.setCustomValidity(
          "Please enter a valid name (2-50 characters, letters only)"
        );
        isValid = false;
      } else {
        nameInput.setCustomValidity("");
      }

      // Email validation
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!email || !emailPattern.test(email)) {
        emailInput.setCustomValidity("Please enter a valid email address");
        isValid = false;
      } else {
        emailInput.setCustomValidity("");
      }

      // Password validation
      const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!password || !passwordPattern.test(password)) {
        passwordInput.setCustomValidity(
          "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character"
        );
        isValid = false;
      } else {
        passwordInput.setCustomValidity("");
      }

      // Confirm password validation
      if (password !== confirmPassword) {
        confirmPasswordInput.setCustomValidity("Passwords do not match");
        isValid = false;
      } else {
        confirmPasswordInput.setCustomValidity("");
      }

      // Trigger validation display
      registrationForm.reportValidity();

      // If any validation fails, stop submission
      if (!isValid) {
        return;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("confirm_password", confirmPassword);

      // Send registration request
      fetch("php/register.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          console.log("Raw Response:", response);
          return response.json();
        })
        .then((data) => {
          console.log("Registration Response:", data);

          if (data.success) {
            alert(data.message || "Registration successful!");
            window.location.href = "login.html";
          } else {
            alert(data.message || "Registration failed. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Registration Error:", error);
          alert("Registration failed. " + error.message);
        });
    });
  }
});

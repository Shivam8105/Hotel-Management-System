document.addEventListener("DOMContentLoaded", function () {
    // **Login Form Handling**
    const loginForm = document.getElementById("loginForm");
  
    if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); 
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(email)) {
          alert("Please enter a valid email address");
          return;
        }
        if (password.trim() === "") {
          alert("Please enter your password");
          return;
        }
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        fetch("php/login.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              window.location.href = "dashboard.html";
            } else {
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
        event.preventDefault();
        const name = document.getElementById("regName").value;
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        if (password !== confirmPassword) {
          alert("Passwords do not match!");
          return;
        }
        if (name.trim() === "" || email.trim() === "" || password.trim() === "" || confirmPassword.trim() === "") {
          alert("Please fill in all fields.");
          return;
        }
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("confirm_password", confirmPassword);
        fetch("php/register.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              alert(data.message); 
              window.location.href = "login.html"; 
            } else {
              alert(data.message); 
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred. Please try again later.");
          });
      });
    }
  });
  
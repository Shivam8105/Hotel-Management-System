<script>
        function confirmLogout() {
            const confirmation = confirm("Are you sure you want to log out?");
            
            if (confirmation) {
                fetch('logout.php', {
                    method: 'POST',
                    credentials: 'same-origin', 
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .then(response => {
                    if (response.ok) {
                        localStorage.clear();
                        sessionStorage.clear();
                        window.location.href = 'login.html';
                    } else {
                        alert('Logout failed. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Logout error:', error);
                    alert('An error occurred during logout.');
                });
            }
        }
        function checkAuthentication() {
            fetch('check_auth.php', {
                method: 'GET',
                credentials: 'same-origin'
            })
            .then(response => {
                if (response.status === 401) {
                    window.location.href = 'login.html';
                }
                return response.json();
            })
            .then(data => {
                if (!data.authenticated) {
                    window.location.href = 'login.html';
                }
            })
            .catch(error => {
                console.error('Authentication check failed:', error);
                window.location.href = 'login.html';
            });
        }
        document.addEventListener('DOMContentLoaded', checkAuthentication);
    </script>
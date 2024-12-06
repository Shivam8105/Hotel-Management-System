<?php
// Set header to return JSON
header('Content-Type: application/json');

// Database configuration
$host = 'localhost';
$dbUser = 'root';
$dbPassword = '';
$dbName = 'database';

// Create connection
$conn = new mysqli($host, $dbUser, $dbPassword, $dbName);

// Check connection
if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed'
    ]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Sanitize input
    $email = $conn->real_escape_string($_POST['email']);
    $password = $_POST['password'];

    // Prepared statement for querying the user
    $stmt = $conn->prepare("SELECT password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($hashedPassword);
        $stmt->fetch();

        // Verify password
        if (password_verify($password, $hashedPassword)) {
            echo json_encode([
                'success' => true,
                'message' => 'Login successful!'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Invalid email or password.'
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email or password.'
        ]);
    }

    $stmt->close();
}

$conn->close();
?>
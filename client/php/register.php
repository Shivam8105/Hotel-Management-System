<?php
header('Content-Type: application/json');
$host = 'localhost';
$dbUser = 'root'; 
$dbPassword = ''; 
$dbName = 'database';
$conn = new mysqli($host, $dbUser, $dbPassword, $dbName);
if ($conn->connect_error) {
    die(json_encode([
        'success' => false,
        'message' => "Connection failed: " . $conn->connect_error
    ]));
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    if ($password != $confirm_password) {
        die(json_encode([
            'success' => false,
            'message' => 'Passwords do not match!'
        ]));
    }
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $stmt->close();
        die(json_encode([
            'success' => false,
            'message' => 'Email already registered!'
        ]));
    }
    $stmt->close();

    $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $email, $password);

    if ($stmt->execute()) {
        die(json_encode([
            'success' => true,
            'message' => 'Registration successful! You can now login.'
        ]));
    } else {
        die(json_encode([
            'success' => false,
            'message' => 'Error: ' . $stmt->error
        ]));
    }
    $stmt->close();
}

$conn->close();
?>

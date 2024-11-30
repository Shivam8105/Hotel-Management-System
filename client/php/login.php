<?php
header('Content-Type: application/json');
$host = 'localhost';
$dbUser = 'root';
$dbPassword = '';
$dbName = 'database';
$conn = new mysqli($host, $dbUser, $dbPassword, $dbName);
if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed'
    ]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $conn->real_escape_string($_POST['email']);
    $password = $_POST['password'];
    $stmt = $conn->prepare("SELECT password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($storedPassword);
        $stmt->fetch();
        if ($password === $storedPassword) {
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

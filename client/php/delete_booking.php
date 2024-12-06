<?php
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $data);
    $id = $data['id'];

    // Connect to the database
    $conn = new mysqli('localhost', 'username', 'password', 'database');

    if ($conn->connect_error) {
        http_response_code(500);
        echo "Connection failed: " . $conn->connect_error;
        exit;
    }

    // Prepare and execute delete query
    $stmt = $conn->prepare("DELETE FROM bookings WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo "Booking deleted successfully";
    } else {
        http_response_code(500);
        echo "Error deleting booking: " . $conn->error;
    }

    $stmt->close();
    $conn->close();
}

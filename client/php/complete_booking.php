<?php
// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "";
$database = "database";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        "status" => "error", 
        "message" => "Connection failed: " . $conn->connect_error
    ]));
}

// Check if booking ID is received
if (!isset($_POST['booking_id'])) {
    die(json_encode([
        "status" => "error", 
        "message" => "No booking ID provided"
    ]));
}

// Sanitize the booking ID
$booking_id = $conn->real_escape_string($_POST['booking_id']);

// Prepare SQL to update booking status
$sql = "UPDATE bookings SET booking_status = 'completed' WHERE id = '$booking_id'";

// Execute the query
if ($conn->query($sql) === TRUE) {
    echo json_encode([
        "status" => "success", 
        "message" => "Booking completed successfully"
    ]);
} else {
    echo json_encode([
        "status" => "error", 
        "message" => "Error completing booking: " . $conn->error
    ]);
}

// Close the connection
$conn->close();
?>
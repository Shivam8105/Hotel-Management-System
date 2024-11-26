<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "database";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Retrieve completed bookings from the 'bookings' table
$sql = "SELECT * FROM bookings WHERE booking_status = 'completed'";
$result = $conn->query($sql);

$bookings = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
}

// Return the bookings data in JSON format
header('Content-Type: application/json');
echo json_encode($bookings);

$conn->close();
?>
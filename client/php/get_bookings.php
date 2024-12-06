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

// Total rooms (hardcoded as 30 per your requirement)
$total_rooms = 30;

// Count active bookings to determine available rooms
$booking_count_sql = "SELECT COUNT(*) AS booked_rooms FROM bookings WHERE booking_status = 'active'";
$booking_count_result = $conn->query($booking_count_sql);
$booking_count_row = $booking_count_result->fetch_assoc();
$booked_rooms = $booking_count_row['booked_rooms'];
$available_rooms = $total_rooms - $booked_rooms;

// Retrieve active bookings from the 'bookings' table
$sql = "SELECT * FROM bookings WHERE booking_status = 'active'";
$result = $conn->query($sql);

$bookings = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
}

// Prepare response with bookings and room availability
$response = [
    'bookings' => $bookings,
    'total_rooms' => $total_rooms,
    'booked_rooms' => $booked_rooms,
    'available_rooms' => $available_rooms
];

// Return the data in JSON format
header('Content-Type: application/json');
echo json_encode($bookings);
// echo json_encode($response);

$conn->close();
?>
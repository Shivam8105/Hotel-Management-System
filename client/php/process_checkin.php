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

// Retrieve form data
$name = $_POST['name'];
$email = $_POST['email'];
$roomType = $_POST['room-type'];
$roomPrice = $_POST['room-price'];
$checkinDate = $_POST['checkin-date'];
$checkoutDate = $_POST['checkout-date'];

// Insert data into the 'bookings' table
$sql = "INSERT INTO bookings (name, email, room_type, room_price, checkin_date, checkout_date, booking_status)
        VALUES ('$name', '$email', '$roomType', $roomPrice, '$checkinDate', '$checkoutDate', 'active')";

if ($conn->query($sql) === TRUE) {
    header("Location: ../bookings.html");
    exit;
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
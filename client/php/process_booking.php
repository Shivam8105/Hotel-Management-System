<?php
session_start();
include 'db_connection.php';

if (!isset($_SESSION['username'])) {
    header("Location: login.php");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_SESSION['username'];
    $room_type = $_POST['room_type'];
    $room_price = $_POST['room_price'];
    $check_in = $_POST['check_in'];
    $check_out = $_POST['check_out'];
    $guests = $_POST['guests'];

    $stmt = $conn->prepare("INSERT INTO bookings 
        (username, room_type, room_price, check_in_date, check_out_date, guests) 
        VALUES (?, ?, ?, ?, ?, ?)");
    
    $stmt->bind_param("sssssi", $username, $room_type, $room_price, $check_in, $check_out, $guests);
    
    if ($stmt->execute()) {
        header("Location: bookings.html?booking=success");
    } else {
        echo "Booking failed: " . $stmt->error;
    }
    
    $stmt->close();
    $conn->close();
}
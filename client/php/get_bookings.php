<?php
session_start();
include 'db_connection.php';

header('Content-Type: application/json');

if (!isset($_SESSION['username'])) {
    echo json_encode([]);
    exit();
}

$username = $_SESSION['username'];
$stmt = $conn->prepare("SELECT room_type, room_price, check_in_date, check_out_date FROM bookings WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

$bookings = $result->fetch_all(MYSQLI_ASSOC);
echo json_encode($bookings);

$stmt->close();
$conn->close();
<?php
include 'send_email.php';

// Example: Get booking details from a form submission
$name = $_POST['name'];
$email = $_POST['email'];
$roomType = $_POST['room_type'];
$checkinDate = $_POST['checkin_date'];
$checkoutDate = $_POST['checkout_date'];

// Store booking details in the database (add your database logic here)

// After successful database insertion, send the email
sendBookingEmail($name, $email, $roomType, $checkinDate, $checkoutDate);
?>

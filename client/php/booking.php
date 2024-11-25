<?php
session_start();
if (!isset($_SESSION['username'])) {
    header("Location: login.php");
    exit();
}

$room_type = $_GET['room_type'] ?? '';
$room_price = $_GET['room_price'] ?? '';
?>

<!DOCTYPE html>
<html>
<head>
    <title>Book <?php echo htmlspecialchars($room_type); ?></title>
</head>
<body>
    <h1>Book Room: <?php echo htmlspecialchars($room_type); ?></h1>
    <form action="process_booking.php" method="POST">
        <input type="hidden" name="room_type" value="<?php echo htmlspecialchars($room_type); ?>">
        <input type="hidden" name="room_price" value="<?php echo htmlspecialchars($room_price); ?>">
        
        <label>Check-in Date:</label>
        <input type="date" name="check_in" required>
        
        <label>Check-out Date:</label>
        <input type="date" name="check_out" required>
        
        <label>Number of Guests:</label>
        <input type="number" name="guests" min="1" max="4" required>
        
        <button type="submit">Confirm Booking</button>
    </form>
</body>
</html>
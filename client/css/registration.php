<?php
$servername = "localhost";
$username = "your_db_username";
$password = "your_db_password";
$dbname = "hotel_management";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
function registerUser($username, $email, $password, $first_name, $last_name, $phone_number) {
    global $conn;
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO Users (username, email, password_hash, first_name, last_name, phone_number) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $username, $email, $hashed_password, $first_name, $last_name, $phone_number);
    
    if ($stmt->execute()) {
        return $stmt->insert_id; 
    } else {
        return false; 
    }
}

function checkInGuest($booking_id, $guest_name, $guest_email, $guest_phone, $id_type, $id_number) {
    global $conn;
    $update_booking = $conn->prepare("UPDATE Bookings SET status = 'checked_in' WHERE booking_id = ?");
    $update_booking->bind_param("i", $booking_id);
    $update_booking->execute();
    
    $stmt = $conn->prepare("INSERT INTO CheckInDetails (booking_id, actual_check_in_time, guest_name, guest_email, guest_phone, identification_type, identification_number) VALUES (?, NOW(), ?, ?, ?, ?, ?)");
    $stmt->bind_param("isssss", $booking_id, $guest_name, $guest_email, $guest_phone, $id_type, $id_number);

    $update_room = $conn->prepare("UPDATE Rooms r JOIN Bookings b ON r.room_id = b.room_id SET r.status = 'occupied' WHERE b.booking_id = ?");
    $update_room->bind_param("i", $booking_id);
    $update_room->execute();
    
    return $stmt->execute();
}

function getRecentBookings($limit = 5) {
    global $conn;
    
    $query = "SELECT b.booking_id, u.first_name, u.last_name, r.room_number, rt.type_name, 
                     b.check_in_date, b.check_out_date, b.status
              FROM Bookings b
              JOIN Users u ON b.user_id = u.user_id
              JOIN Rooms r ON b.room_id = r.room_id
              JOIN RoomTypes rt ON r.room_type_id = rt.room_type_id
              ORDER BY b.booking_date DESC
              LIMIT ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $limit);
    $stmt->execute();
    $result = $stmt->get_result();
    
    return $result->fetch_all(MYSQLI_ASSOC);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['register'])) {
        $user_id = registerUser(
            $_POST['username'], 
            $_POST['email'], 
            $_POST['password'], 
            $_POST['first_name'], 
            $_POST['last_name'], 
            $_POST['phone_number']
        );
        
        if ($user_id) {
            header("Location: dashboard.php");
        } else {
            echo "Registration failed";
        }
    }
    
    if (isset($_POST['check_in'])) {
        $check_in_success = checkInGuest(
            $_POST['booking_id'],
            $_POST['guest_name'],
            $_POST['guest_email'],
            $_POST['guest_phone'],
            $_POST['id_type'],
            $_POST['id_number']
        );
        
        if ($check_in_success) {
            header("Location: dashboard.php");
        } else {
            echo "Check-in failed";
        }
    }
}

$recent_bookings = getRecentBookings();
?>

<table>
    <thead>
        <tr>
            <th>Guest Name</th>
            <th>Room</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Status</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($recent_bookings as $booking): ?>
        <tr>
            <td><?php echo htmlspecialchars($booking['first_name'] . ' ' . $booking['last_name']); ?></td>
            <td><?php echo htmlspecialchars($booking['room_number'] . ' - ' . $booking['type_name']); ?></td>
            <td><?php echo htmlspecialchars($booking['check_in_date']); ?></td>
            <td><?php echo htmlspecialchars($booking['check_out_date']); ?></td>
            <td><?php echo htmlspecialchars($booking['status']); ?></td>
            <td><a href="checkin.php?booking_id=<?php echo $booking['booking_id']; ?>">Check In</a></td>
        </tr>
        <?php endforeach; ?>
    </tbody>
</table>
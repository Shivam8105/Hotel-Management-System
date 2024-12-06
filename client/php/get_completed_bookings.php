<?php
// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$database = "database";

try {
    // Create a new MySQLi connection
    $conn = new mysqli($servername, $username, $password, $database);

    // Check for connection errors
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // SQL query to retrieve completed bookings
    $sql = "SELECT * FROM bookings WHERE booking_status = 'completed'";
    $result = $conn->query($sql);

    // Initialize an array to store bookings
    $bookings = array();

    // Check if rows were returned
    if ($result && $result->num_rows > 0) {
        // Fetch all rows into the $bookings array
        while ($row = $result->fetch_assoc()) {
            $bookings[] = $row;
        }
    }

    // Set response header to JSON
    header('Content-Type: application/json');

    // Output bookings as JSON
    echo json_encode($bookings);

} catch (Exception $e) {
    // Handle errors by returning a JSON error message
    header('Content-Type: application/json', true, 500);
    echo json_encode(array("error" => $e->getMessage()));
} finally {
    // Close the connection
    if (isset($conn) && $conn->ping()) {
        $conn->close();
    }
}

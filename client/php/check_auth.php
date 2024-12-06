<?php
session_start();
$authenticated = isset($_SESSION['user_id']);

header('Content-Type: application/json');
echo json_encode([
    'authenticated' => $authenticated
]);
exit();
?>
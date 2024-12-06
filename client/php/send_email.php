<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load PHPMailer via Composer's autoload
require 'vendor/autoload.php';

function sendBookingEmail($name, $email, $roomType, $checkinDate, $checkoutDate) {
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; // Use your email server (e.g., Gmail, Outlook)
        $mail->SMTPAuth = true;
        $mail->Username = 'your-email@example.com'; // Your email
        $mail->Password = 'your-email-password';   // Your email password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Recipients
        $mail->setFrom('your-email@example.com', 'Radisson Blu Hotel');
        $mail->addAddress($email, $name);

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Booking Confirmation';
        $template = file_get_contents('email_template.html');

        // Replace placeholders with actual data
        $template = str_replace('{{name}}', $name, $template);
        $template = str_replace('{{room_type}}', $roomType, $template);
        $template = str_replace('{{checkin_date}}', $checkinDate, $template);
        $template = str_replace('{{checkout_date}}', $checkoutDate, $template);

        $mail->Body = $template;

        $mail->send();
        echo 'Booking confirmation email sent successfully.';
    } catch (Exception $e) {
        echo "Error: Email could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
?>

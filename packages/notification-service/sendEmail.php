<?php

// Assuming email data comes from POST request
$email = $_POST['email'] ?? '';
$subject = $_POST['subject'] ?? 'No Subject';
$message = $_POST['message'] ?? '';

// Basic validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "Invalid email address";
    exit;
}

// Send email
if (mail($email, $subject, $message)) {
    echo "Email sent to {$email}";
} else {
    echo "Email sending failed";
}

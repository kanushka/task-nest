<?php

// Simple router
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($path == "/status") {
    // Status endpoint
    echo "Notification Service is running";
} elseif ($path == "/send-notification" && $_SERVER['REQUEST_METHOD'] == 'POST') {
    // Send notification endpoint
    include 'sendEmail.php';
} else {
    // Not Found
    header("HTTP/1.0 404 Not Found");
    echo "404 Not Found";
}

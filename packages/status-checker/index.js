const axios = require("axios");

const projectServices = [
    { name: "User Service (project)", url: "http://user-service-885045017:3000/users" },
    { name: "Todo Service (project)", url: "http://todo-service-1123905988:5000/todos" },
    { name: "Notification Service (project)", url: "http://notification-service-2269431989:7000/notifications" },
];

const devPublicServices = [
    {
        name: "User Service (public)",
        url: process.env.USER_SERVICE_URL_PUBLIC,
    },
    {
        name: "Todo Service (public)",
        url: process.env.TODO_SERVICE_URL_PUBLIC,
    },
    {
        name: "Notification Service (public)",
        url: process.env.NOTIFY_SERVICE_URL_PUBLIC,
    },
];

function log(message, type = "INFO") {
    const dateTime = new Date().toISOString();
    console.log(`[${dateTime}] [${type}] ${message}`);
}

function checkServiceStatus(service) {
    axios
        .get(service.url + "/status")
        .then((response) => {
            log(`${service.name} is up: Response - ${JSON.stringify(response.data)}`);
        })
        .catch((error) => {
            log(`Error accessing ${service.name}: ${error.message}`, "ERROR");
        });
}

// Check the status of each service
log(">>> Checking service project endpoint statuses...");
projectServices.forEach((service) => checkServiceStatus(service));
log(">>> Checking service public endpoint statuses...");
devPublicServices.forEach((service) => checkServiceStatus(service));

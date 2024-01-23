const axios = require("axios");

const projectServices = [
    {
        name: "User Service (project)",
        url: process.env.USER_SERVICE_URL_PROJECT,
    },
    {
        name: "Todo Service (project)",
        url: process.env.TODO_SERVICE_URL_PROJECT,
    },
    {
        name: "Notification Service (project)",
        url: process.env.NOTIFY_SERVICE_URL_PROJECT,
    },
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
log(">>> Checking service statuses...");
projectServices.forEach((service) => checkServiceStatus(service));
devPublicServices.forEach((service) => checkServiceStatus(service));

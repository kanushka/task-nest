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
        name: "Notification Service (Organization)",
        url: process.env.NOTIFY_SERVICE_URL_ORG,
    },
];

const delay = process.env.DELAY || 2000;

function log(message, type = "INFO") {
    const dateTime = new Date().toISOString();
    console.log(`[${dateTime}] [${type}] ${message}`);
}

async function checkServiceStatus(service) {
    try {
        const response = await axios.get(service.url + "/status");
        log(`${service.name} is up: Response - ${JSON.stringify(response.data)}`);
    } catch (error) {
        log(`Error accessing ${service.name} from ${service.url}/status : ${error.message}`, "ERROR");
    }
}

async function checkAllServiceStatuses() {
    log("Starting status checks");
    for (const service of projectServices) {
        await checkServiceStatus(service);
        await new Promise((resolve) => setTimeout(resolve, delay));
    }

    for (const service of devPublicServices) {
        await checkServiceStatus(service);
        await new Promise((resolve) => setTimeout(resolve, delay));
    }
}

checkAllServiceStatuses()
    .then(() => {
        log("Status checks complete");
    })
    .catch((error) => {
        log(`Error occurred during status checks: ${error.message}`, "ERROR");
    });

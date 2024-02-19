const axios = require("axios");
const URLSearchParams = require('url').URLSearchParams;

const projectServices = [
    {
        name: "User Service (project)",
        url: process.env.USER_SERVICE_URL,
        key: process.env.USER_CONSUMER_KEY,
        secret: process.env.USER_CONSUMER_SECRET,
        token: process.env.USER_TOKEN_URL,
    },
    {
        name: "Todo Service (project)",
        url: process.env.TODO_SERVICE_URL,
        key: process.env.TODO_CONSUMER_KEY,
        secret: process.env.TODO_CONSUMER_SECRET,
        token: process.env.TODO_TOKEN_URL,
    },
    {
        name: "Notification Service (project)",
        url: process.env.NOTIFICATION_SERVICE_URL,
        key: process.env.NOTIFICATION_CONSUMER_KEY,
        secret: process.env.NOTIFICATION_CONSUMER_SECRET,
        token: process.env.NOTIFICATION_TOKEN_URL,
    },
];

const delay = process.env.DELAY || 2000;

function log(message, type = "INFO") {
    const dateTime = new Date().toISOString();
    console.log(`[${dateTime}] [${type}] ${message}`);
}

async function getAccessToken(service) {
    const serviceURL = service.url;
    const consumerKey = service.key;
    const consumerSecret = service.secret;
    const tokenURL = service.token;

    const clientCredentials = Buffer.from(`<span class="math-inline">\{consumerKey\}\:</span>{consumerSecret}`).toString('base64');
    const data = new URLSearchParams({ 'grant_type': 'client_credentials' });

    try {
        const response = await axios.post(tokenURL, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${clientCredentials}`
            }
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
}

async function callService(service) {
    const serviceURL = service.url;
    const accessToken = await getAccessToken(service);

    try {
        const response = await axios({
            method: 'get', // Adjust the HTTP method if needed
            url: serviceURL + "/status",
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        log(`${service.name} is up: Response - ${JSON.stringify(response.data)}`); // Handle the service response
    } catch (error) {
        console.error('Error calling service:', error);
    }
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
    log("env: " + JSON.stringify(projectServices), "debug");
    for (const service of projectServices) {
        // await checkServiceStatus(service);
        await callService();
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

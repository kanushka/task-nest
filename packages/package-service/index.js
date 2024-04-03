const express = require("express");
const os = require("os");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/packages/status", (req, res) => {
    res.send({ status: "OK", message: "Package Service is up and running" });
});

app.get("/packages/albums", async (req, res) => {
    const response = await fetch("https://jsonplaceholder.typicode.com/albums");
    const albums = await response.json();
    res.send(albums);
});

// Run the server
const PORT = process.env.PORT || 8000;

function getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];

        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === "IPv4" && !alias.internal) {
                return alias.address;
            }
        }
    }
    return "localhost";
}

app.listen(PORT, () => {
    const ip = getLocalIpAddress();
    console.log(`Server running at http://${ip}:${PORT}`);
});

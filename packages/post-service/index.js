const express = require("express");
const os = require("os");
const cors = require("cors");
const { create } = require("domain");
const faker = require("faker");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send({ status: "OK", message: "Posts app is up and running" });
});

app.get("/posts", async (req, res) => {
    const generateDummyPosts = () => {
        const posts = [];
        for (let i = 0; i < 10; i++) {
            const post = {
                id: faker.random.number(),
                title: faker.lorem.sentence(),
                content: faker.lorem.paragraph(),
                created_at: faker.date.past().toISOString(),
            };
            posts.push(post);
        }
        return posts;
    };

    const posts = {
        data: generateDummyPosts(),
    };

    res.send(posts);
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

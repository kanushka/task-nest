const express = require("express");
const os = require("os");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const saltRounds = 10;
const secretKey = process.env.JWT_SECRET_KEY;

// Create a database
const db = new sqlite3.Database("users.db", (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Connected to the SQLite database.");
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.run(
        `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )`,
        (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log("Initialized users table.");
            }
        }
    );
}

// Endpoint server status and database connection status
app.get("/users/status", (req, res) => {
    db.get("SELECT 1", (err) => {
        if (err) {
            res.status(500).send({ status: "ERROR", message: "Database connection error", error: err.message });
        }
    });
    res.send({ status: "OK", message: "User Service is up and running" });
});

// Endpoint server health
app.get("/users/health", (req, res) => {
    res.send({ status: "OK"});
});

// Endpoint to create a new user
app.post("/users/create-user", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ message: "Username and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Add user to the database
    const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(sql, [username, hashedPassword], function (err) {
        if (err) {
            return res.status(500).send({ message: "Error creating user", error: err.message });
        }

        // Test user service - need to implement correctly
        axios.get("http://user-service-885045017:4000/users/status")

        res.status(201).send({ message: "User created", userId: this.lastID });
    });
});

// Endpoint to login a user
app.post("/users/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ message: "Username and password are required" });
    }

    const sql = `SELECT * FROM users WHERE username = ?`;
    db.get(sql, [username], async (err, user) => {
        if (err) {
            return res.status(500).send({ message: "Error logging in", error: err.message });
        }
        if (!user) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });
            res.send({ token });
        } else {
            res.status(401).send({ message: "Invalid credentials" });
        }
    });
});

// Run the server
const PORT = process.env.PORT || 3000;

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

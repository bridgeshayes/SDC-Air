import express from "express";
import sqlite3 from "sqlite3";

const dbpool = sqlite3.createPool({
    filename: "./database/airbnb_workshop.db",
    driver: sqlite3.Database,
});

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/register", (req, res) => {
    const { username, email, password, first_name, last_name, is_host } = req.body;
    const query = `INSERT INTO users (username, email, password, first_name, last_name, is_host) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [username, email, password, first_name, last_name, is_host];
    dbpool.run(query, params, (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
    res.send("User registered");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

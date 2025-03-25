import express from "express";
import sqlite3 from "sqlite3";
import bodyParser from "body-parser";

const db = new sqlite3.Database("../database/airbnb_workshop.db");

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/register", (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const is_host = req.body.is_host;
    const query = `INSERT INTO users (username, email, password, first_name, last_name, is_host) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [username, email, password, first_name, last_name, is_host];
    db.run(query, params, (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
    res.status(200).send("User registered");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

app.post("/login", (req, res) => {
    const { username, password }= req.body;
    const dbQuery = `SELECT username,password FROM users WHERE username = ?`;
    db.run(dbQuery, params, (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
    if (dbQuery.username == username && dbQuery.password == password) {
        res.status(200).send({"message": "All good!"});
    }
    else {
        res.status(400).send({"message" : "Not good :("});
    }
})

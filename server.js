const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2/promise");
const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "book",
});

app.get("/", (req, res) => {
    res.send("kitsada");
});

app.get('/books', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [results] = await connection.execute('SELECT * FROM users');
        connection.release();
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/book/insert', async (req, res) => {
    const { firstname, lastname	, email } = req.body;
    try {
        const connection = await pool.getConnection();
        const [results] = await connection.execute(
            'INSERT INTO users (firstname, lastname, email) VALUES (?, ?, ?)',
            [firstname, lastname, email]
        );
        connection.release();
        res.json({ id: results.insertId, firstname, lastname, email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/book/:id', async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email } = req.body;
    try {
        const connection = await pool.getConnection();
        await connection.execute(
            'UPDATE users SET firstname = ?, lastname = ?, email = ? WHERE id = ?',
            [firstname, lastname, email, id]
        );
        connection.release();
        res.json({ id, firstname, lastname, email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/book/:id', async (req, res) => {
    const { id } = req.params;
    const { firstname } = req.body;
    try {
        const connection = await pool.getConnection();
        await connection.execute(
            'UPDATE users SET firstname = ? WHERE id = ?',
            [firstname, id]
        );
        connection.release();
        res.json({ id, firstname });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/book/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await pool.getConnection();
        await connection.execute('DELETE FROM users WHERE id = ?', [id]);
        connection.release();
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(8000, () => {
    console.log("Server is running on http://localhost:8000");
});
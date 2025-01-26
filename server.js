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
    database: "book_api",
});

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get('/books', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [results] = await connection.execute('SELECT * FROM book_list');
        connection.release();
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/book/insert', async (req, res) => {
    const { title, author, published_date } = req.body;
    try {
        const connection = await pool.getConnection();
        const [results] = await connection.execute(
            'INSERT INTO book_list (title, author, published_date) VALUES (?, ?, ?)',
            [title, author, published_date]
        );
        connection.release();
        res.json({ id: results.insertId, title, author, published_date });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/book/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, published_date } = req.body;
    try {
        const connection = await pool.getConnection();
        await connection.execute(
            'UPDATE book_list SET title = ?, author = ?, published_date = ? WHERE id = ?',
            [title, author, published_date, id]
        );
        connection.release();
        res.json({ id, title, author, published_date });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/book/:id', async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    try {
        const connection = await pool.getConnection();
        await connection.execute(
            'UPDATE book_list SET title = ? WHERE id = ?',
            [title, id]
        );
        connection.release();
        res.json({ id, title });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/book/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await pool.getConnection();
        await connection.execute('DELETE FROM book_list WHERE id = ?', [id]);
        connection.release();
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(8000, () => {
    console.log("Server is running on http://localhost:8000");
});
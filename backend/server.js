const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('database.sqlite');
db.run(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  completed INTEGER DEFAULT 0,
  date TEXT DEFAULT (date('now'))
)`);

app.post('/tasks', (req, res) => {
  const { title } = req.body;
  db.run('INSERT INTO tasks (title) VALUES (?)', [title], function() {
    res.json({ id: this.lastID, title, completed: 0 });
  });
});

app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY id', (err, rows) => res.json(rows));
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  db.run('UPDATE tasks SET completed = ? WHERE id = ?', [completed ? 1 : 0, id], () => {
    res.json({ success: true });
  });
});

app.get('/streak', (req, res) => {
  db.get('SELECT COUNT(DISTINCT date) as streak FROM tasks WHERE completed = 1', (err, row) => {
    res.json({ streak: row.streak || 0 });
  });
});

app.listen(3000, () => console.log('API rodando na porta 3000'));

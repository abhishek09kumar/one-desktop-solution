const db = require('../database');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        items TEXT,
        total REAL,
        payment_received REAL,
        change_given REAL
    )`);
});

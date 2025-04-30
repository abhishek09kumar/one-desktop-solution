const db = require('../database');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        specifics TEXT,
        purchase_date TEXT,
        quantity INTEGER,
        purchase_price REAL,
        discount REAL,
        mrp REAL,
        expiry_date TEXT,
        quantity_sold INTEGER DEFAULT 0,
        quantity_returned INTEGER DEFAULT 0,
        created_at TEXT,
        updated_at TEXT
    )`);
});
    
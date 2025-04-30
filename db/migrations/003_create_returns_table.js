const db = require('../database');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS returns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        return_date TEXT,
        quantity_returned INTEGER,
        discount_applied REAL,
        expected_return_amount REAL,
        actual_return_amount REAL,
        remarks TEXT
    )`);
});

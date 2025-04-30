const db = require('./database');

db.serialize(() => {
    db.run('DROP TABLE IF EXISTS sales;', (err) => {
        if (err) {
            console.error('Error dropping sales table:', err.message);
        } else {
            console.log('sales table dropped successfully.');
        }
        db.close();
    });
});
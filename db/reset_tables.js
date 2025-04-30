const db = require('./database');

db.serialize(() => {
    db.run('DELETE FROM sales;', (err) => {
        if (err) {
            console.error('Error clearing sales table:', err.message);
        } else {
            console.log('Sales table cleared.');
        }
    });
    db.run('DELETE FROM returns;', (err) => {
        if (err) {
            console.error('Error clearing returns table:', err.message);
        } else {
            console.log('Returns table cleared.');
        }
    });
    db.close();
});
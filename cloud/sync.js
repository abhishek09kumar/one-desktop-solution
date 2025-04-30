const db = require('../db/database');
const axios = require('axios');

async function syncTable(table, endpoint) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM ${table}`, [], async (err, rows) => {
            if (err) return reject(err);
            try {
                const res = await axios.post(endpoint, { data: rows });
                resolve(res.data);
            } catch (e) {
                reject(e);
            }
        });
    });
}

async function syncAll() {
    try {
        await syncTable('products', 'http://localhost:4000/sync/products');
        await syncTable('sales', 'http://localhost:4000/sync/sales');
        await syncTable('returns', 'http://localhost:4000/sync/returns');
        console.log('Sync complete!');
    } catch (e) {
        console.error('Sync failed:', e.message);
    } finally {
        db.close();
    }
}

syncAll();
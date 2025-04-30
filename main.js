const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const db = require('./db/database');
const cron = require('node-cron');
const { exec } = require('child_process');

function createWindow () {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,  // Set to false for security
            contextIsolation: true,  // Make sure context isolation is enabled
        }
    });

    // Check if Vite is running in development mode
    if (process.env.NODE_ENV === 'development') {
        console.log('Loading React app from Vite dev server...');
        win.loadURL('http://localhost:5173');
    } else {
        const prodPath = path.join(__dirname, 'renderer/dist/index.html');
        console.log('Loading React app from build:', prodPath);
        win.loadFile(prodPath);
    }

    // Check for expiring products and show notification if any
    db.all(
        `SELECT name, specifics, expiry_date FROM products WHERE expiry_date IS NOT NULL AND DATE(expiry_date) <= DATE('now', '+30 days') AND DATE(expiry_date) >= DATE('now')`,
        [],
        (err, rows) => {
            if (!err && rows.length > 0) {
                new Notification({
                    title: 'Expiring Products Alert',
                    body: `There are ${rows.length} SKUs expiring in the next 30 days.`
                }).show();
            }
        }
    );
}

// Schedule to run every day at 2:00 AM
cron.schedule('0 2 * * *', () => {
    exec('npm run cloud:sync', { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
            console.error('Sync failed:', stderr);
        } else {
            console.log('Cloud sync complete:', stdout);
        }
    });
});

app.whenReady().then(createWindow);

// Quit app when all windows are closed (except for macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Recreate the window if the app is activated (macOS specific)
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// IPC Handlers for communication with the React frontend
ipcMain.handle('add-product', async (event, product) => {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(`INSERT INTO products 
            (name, specifics, purchase_date, quantity, purchase_price, discount, mrp, expiry_date, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`);
        
        stmt.run(
            product.name,
            product.specifics,
            product.purchase_date,
            product.quantity,
            product.purchase_price,
            product.discount,
            product.mrp,
            product.expiry_date,
            function(err) {
                resolve({ success: !err });
            }
        );
    });
});

// Add a return record and update inventory
ipcMain.handle('add-return', async (event, returnData) => {
    return new Promise((resolve, reject) => {
        // Insert into returns table
        const stmt = db.prepare(`INSERT INTO returns 
            (product_id, return_date, quantity_returned, discount_applied, expected_return_amount, actual_return_amount, remarks)
            VALUES (?, ?, ?, ?, ?, ?, ?)`);
        stmt.run(
            returnData.product_id,
            returnData.return_date,
            returnData.quantity_returned,
            returnData.discount_applied,
            returnData.expected_return_amount,
            returnData.actual_return_amount,
            returnData.remarks,
            function(err) {
                if (err) return reject(err);
                // Update product quantity
                db.run(
                    `UPDATE products SET quantity = quantity - ? WHERE id = ?`,
                    [returnData.quantity_returned, returnData.product_id],
                    (err2) => {
                        if (err2) return reject(err2);
                        resolve({ success: true });
                    }
                );
            }
        );
    });
});

// Save a sale
ipcMain.handle('save-sale', async (event, sale) => {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(`INSERT INTO sales 
            (date, items, total, payment_received, change_given)
            VALUES (?, ?, ?, ?, ?)`);
        stmt.run(
            sale.date,
            JSON.stringify(sale.items),
            sale.total,
            sale.payment_received,
            sale.change_given,
            function(err) {
                if (err) return reject(err);
                // Optionally, update inventory for each item sold
                sale.items.forEach(item => {
                    db.run(
                        `UPDATE products SET quantity = quantity - ? WHERE id = ?`,
                        [item.quantity, item.id]
                    );
                });
                resolve({ success: !err });
            }
        );
    });
});

// Other IPC handlers...



// Get All Products
ipcMain.handle('get-products', async () => {
    return new Promise((resolve) => {
        db.all(`SELECT * FROM products`, [], (err, rows) => {
            resolve(err ? [] : rows);
        });
    });
});

// Delete Product
ipcMain.handle('delete-product', async (event, id) => {
    return new Promise((resolve) => {
        db.run(`DELETE FROM products WHERE id = ?`, [id], function(err) {
            resolve({ success: !err });
        });
    });
});

// Get Product By ID
ipcMain.handle('get-product-by-id', async (event, id) => {
    return new Promise((resolve) => {
        db.get(`SELECT * FROM products WHERE id = ?`, [id], (err, row) => {
            resolve(err ? null : row);
        });
    });
});

// Update Product
ipcMain.handle('update-product', async (event, product) => {
    return new Promise((resolve) => {
        const stmt = db.prepare(`UPDATE products 
            SET name = ?, specifics = ?, purchase_date = ?, quantity = ?, 
                purchase_price = ?, discount = ?, mrp = ?, expiry_date = ?, updated_at = datetime('now') 
            WHERE id = ?`);
        
        stmt.run(
            product.name,
            product.specifics,
            product.purchase_date,
            product.quantity,
            product.purchase_price,
            product.discount,
            product.mrp,
            product.expiry_date,
            product.id,
            function(err) {
                resolve({ success: !err });
            }
        );
    });
});

// Get Products Expiring in Next 30 Days
ipcMain.handle('get-expiring-products', async () => {
    return new Promise((resolve) => {
        db.all(
            `SELECT * FROM products WHERE expiry_date IS NOT NULL AND DATE(expiry_date) <= DATE('now', '+30 days') AND DATE(expiry_date) >= DATE('now')`,
            [],
            (err, rows) => {
                resolve(err ? [] : rows);
            }
        );
    });
});

// Get all returns
ipcMain.handle('get-returns', async () => {
    return new Promise((resolve) => {
        db.all(`SELECT * FROM returns`, [], (err, rows) => {
            resolve(err ? [] : rows);
        });
    });
});

// Search products for billing (type-ahead)
ipcMain.handle('search-products', async (event, query) => {
    return new Promise((resolve) => {
        db.all(
            `SELECT * FROM products WHERE name LIKE ? OR specifics LIKE ?`,
            [`%${query}%`, `%${query}%`],
            (err, rows) => {
                resolve(err ? [] : rows);
            }
        );
    });
});
//Manual Sync 

ipcMain.handle('manual-sync', async () => {
    return new Promise((resolve, reject) => {
        exec('npm run cloud:sync', { cwd: __dirname }, (error, stdout, stderr) => {
            if (error) return reject(stderr);
            resolve(stdout);
        });
    });
});

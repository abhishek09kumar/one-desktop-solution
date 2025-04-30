const express = require('express');
const app = express();
app.use(express.json());

app.post('/sync/products', (req, res) => {
    // Save req.body.data to your cloud DB
    console.log('Received products:', req.body.data);
    res.json({ status: 'products synced' });
});

app.post('/sync/sales', (req, res) => {
    console.log('Received sales:', req.body.data);
    res.json({ status: 'sales synced' });
});

app.post('/sync/returns', (req, res) => {
    console.log('Received returns:', req.body.data);
    res.json({ status: 'returns synced' });
});

app.listen(4000, () => console.log('Cloud API running on port 4000'));
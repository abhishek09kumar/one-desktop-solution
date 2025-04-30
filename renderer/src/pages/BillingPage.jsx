import React, { useState } from 'react';

const BillingPage = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [order, setOrder] = useState([]);
    const [payment, setPayment] = useState('');
    const [showInvoice, setShowInvoice] = useState(false);

    // Type-ahead search
    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);
        if (value.length > 1) {
            const results = await window.electron.invoke('search-products', value);
            setSuggestions(results);
        } else {
            setSuggestions([]);
        }
    };

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        setPrice(product.mrp);
        setSuggestions([]);
        setQuery(product.name + (product.specifics ? ` (${product.specifics})` : ''));
    };

    const handleAddToOrder = () => {
        if (!selectedProduct || !quantity || !price) return;
        if (Number(quantity) > selectedProduct.quantity) {
            alert("Cannot sell more than available quantity!");
            return;
        }
        setOrder([...order, {
            ...selectedProduct,
            quantity: Number(quantity),
            price: Number(price)
        }]);
        setSelectedProduct(null);
        setQuery('');
        setQuantity('');
        setPrice('');
    };

    const handleConfirmOrder = async () => {
        await window.electron.invoke('save-sale', {
            date: new Date().toISOString().slice(0, 10),
            items: order,
            total,
            payment_received: Number(payment),
            change_given: Number(payment) - total
        });
        setShowInvoice(true);
    };

    const total = order.reduce((sum, item) => sum + item.quantity * item.price, 0);

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
            <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Billing</h1>
            {!showInvoice ? (
                <>
                    <div className="mb-6">
                        <label className="block mb-2 text-lg font-semibold text-gray-700">Search Product</label>
                        <input
                            type="text"
                            value={query}
                            onChange={handleSearch}
                            className="input border input-bordered w-full px-4 py-2 rounded focus:ring-2 "
                            placeholder="Type product name or specifics"
                        />
                        {suggestions.length > 0 && (
                            <ul className="border bg-white rounded shadow mt-2 max-h-40 overflow-y-auto z-10">
                                {suggestions.map(p => (
                                    <li
                                        key={p.id}
                                        className="px-4 py-2 hover:bg-green-100 cursor-pointer transition"
                                        onClick={() => handleSelectProduct(p)}
                                    >
                                        <span className="font-medium">{p.name}</span> {p.specifics && <span className="text-gray-500">({p.specifics})</span>} <span className="text-xs text-gray-400">- Qty: {p.quantity}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {selectedProduct && (
                        <div className="mb-6 p-4 bg-green-50 rounded shadow flex flex-col gap-2">
                            <div className="font-semibold text-green-800">
                                <strong>Selected:</strong> {selectedProduct.name} {selectedProduct.specifics && `(${selectedProduct.specifics})`}
                            </div>
                            <div className="flex gap-3 mt-2">
                                <input
                                    type="number"
                                    min="1"
                                    max={selectedProduct.quantity}
                                    value={quantity}
                                    onChange={e => setQuantity(e.target.value)}
                                    placeholder="Quantity"
                                    className="input input-bordered px-3 py-2 rounded w-28"
                                />
                                <input
                                    type="number"
                                    min="0"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    placeholder="Price"
                                    className="input input-bordered px-3 py-2 rounded w-32"
                                />
                                <button
                                    className="px-5 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition"
                                    onClick={handleAddToOrder}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    )}
                    {order.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-xl font-bold mb-3 text-green-700">Order Items</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border rounded shadow mb-3">
                                    <thead>
                                        <tr>
                                            <th className="px-3 py-2 border">Product</th>
                                            <th className="px-3 py-2 border">Qty</th>
                                            <th className="px-3 py-2 border">Price</th>
                                            <th className="px-3 py-2 border">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="border px-3 py-2">{item.name} {item.specifics && `(${item.specifics})`}</td>
                                                <td className="border px-3 py-2">{item.quantity}</td>
                                                <td className="border px-3 py-2">{item.price}</td>
                                                <td className="border px-3 py-2">{(item.quantity * item.price).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="text-right font-bold mb-3 text-lg">Total: <span className="text-green-700">₹{total.toFixed(2)}</span></div>
                            <div className="flex gap-3 items-center">
                                <input
                                    type="number"
                                    min={total}
                                    value={payment}
                                    onChange={e => setPayment(e.target.value)}
                                    placeholder="Payment Received"
                                    className="input input-bordered px-3 py-2 rounded w-48 border "
                                />
                                <button
                                    className="px-5 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
                                    onClick={handleConfirmOrder}
                                    disabled={Number(payment) < total || !payment}
                                >
                                    Confirm & Print Invoice
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-white p-8 rounded shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 text-green-700">Invoice</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border rounded shadow mb-4">
                            <thead>
                                <tr>
                                    <th className="px-3 py-2 border">Product</th>
                                    <th className="px-3 py-2 border">Qty</th>
                                    <th className="px-3 py-2 border">Price</th>
                                    <th className="px-3 py-2 border">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="border px-3 py-2">{item.name} {item.specifics && `(${item.specifics})`}</td>
                                        <td className="border px-3 py-2">{item.quantity}</td>
                                        <td className="border px-3 py-2">{item.price}</td>
                                        <td className="border px-3 py-2">{(item.quantity * item.price).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-right font-bold mb-2 text-lg">Total: <span className="text-green-700">₹{total.toFixed(2)}</span></div>
                    <div className="mb-2 text-gray-700">Payment Received: <span className="font-semibold">₹{payment}</span></div>
                    <div className="mb-4 text-gray-700">Change: <span className="font-semibold">₹{(payment - total).toFixed(2)}</span></div>
                    <div className="flex gap-3">
                        <button
                            className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                            onClick={() => {
                                setOrder([]);
                                setPayment('');
                                setShowInvoice(false);
                            }}
                        >
                            New Bill
                        </button>
                        <button
                            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            onClick={() => window.print()}
                        >
                            Print Invoice
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillingPage;

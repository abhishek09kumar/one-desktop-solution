import React, { useEffect, useState } from 'react';

const ReturnsPage = () => {
    const [expiringProducts, setExpiringProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [form, setForm] = useState({
        quantity_returned: '',
        discount_applied: '',
        expected_return_amount: '',
        actual_return_amount: '',
        remarks: ''
    });

    useEffect(() => {
        window.electron.invoke('get-expiring-products').then(setExpiringProducts);
    }, []);

    const handleSelect = (product) => {
        setSelectedProduct(product);
        setForm({
            quantity_returned: product.quantity || '',
            discount_applied: product.discount || '',
            expected_return_amount: '',
            actual_return_amount: '',
            remarks: ''
        });
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Calculate expected return amount
        const expected = (selectedProduct.purchase_price * form.quantity_returned) * (1 - (form.discount_applied / 100));
        await window.electron.invoke('add-return', {
            product_id: selectedProduct.id,
            return_date: new Date().toISOString().slice(0, 10),
            quantity_returned: Number(form.quantity_returned),
            discount_applied: Number(form.discount_applied),
            expected_return_amount: expected,
            actual_return_amount: Number(form.actual_return_amount),
            remarks: form.remarks
        });
        setSelectedProduct(null);
        window.electron.invoke('get-expiring-products').then(setExpiringProducts);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold text-yellow-700 mb-4">Returns</h1>
            {!selectedProduct ? (
                <>
                    <p className="mb-4">Select a product to return:</p>
                    <ul className="space-y-2">
                        {expiringProducts.map(p => (
                            <li key={p.id} className="flex justify-between items-center bg-yellow-50 p-2 rounded">
                                <span>{p.name} ({p.specifics}) - Qty: {p.quantity} - Expiry: {p.expiry_date}</span>
                                <button
                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                    onClick={() => handleSelect(p)}
                                >
                                    Return
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow max-w-md mx-auto">
                    <h2 className="text-lg font-bold mb-2">Return {selectedProduct.name} ({selectedProduct.specifics})</h2>
                    <div className="mb-2">
                        <label className="block mb-1">Quantity to Return</label>
                        <input type="number" name="quantity_returned" value={form.quantity_returned} onChange={handleChange} required className="input input-bordered w-full" min="1" max={selectedProduct.quantity} />
                    </div>
                    <div className="mb-2">
                        <label className="block mb-1">Discount Applied (%)</label>
                        <input type="number" name="discount_applied" value={form.discount_applied} onChange={handleChange} required className="input input-bordered w-full" min="0" max="100" />
                    </div>
                    <div className="mb-2">
                        <label className="block mb-1">Expected Return Amount</label>
                        <input type="number" name="expected_return_amount" value={
                            form.quantity_returned && form.discount_applied
                                ? ((selectedProduct.purchase_price * form.quantity_returned) * (1 - (form.discount_applied / 100))).toFixed(2)
                                : ''
                        } readOnly className="input input-bordered w-full bg-gray-100" />
                    </div>
                    <div className="mb-2">
                        <label className="block mb-1">Actual Return Amount</label>
                        <input type="number" name="actual_return_amount" value={form.actual_return_amount} onChange={handleChange} required className="input input-bordered w-full" min="0" />
                    </div>
                    <div className="mb-2">
                        <label className="block mb-1">Remarks</label>
                        <input type="text" name="remarks" value={form.remarks} onChange={handleChange} className="input input-bordered w-full" />
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button type="submit" className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">Submit Return</button>
                        <button type="button" className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setSelectedProduct(null)}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ReturnsPage;

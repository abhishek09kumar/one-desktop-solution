import React from 'react';

const ProductTable = ({ products, onEdit, onDelete }) => {
    const isExpiringSoon = (expiryDate) => {
        const today = new Date();
        const expDate = new Date(expiryDate);
        const diffDays = (expDate - today) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded shadow">
                <thead>
                    <tr>
                        <th className="bg-blue-500 text-white px-4 py-2">Name</th>
                        <th className="bg-blue-500 text-white px-4 py-2">Quantity</th>
                        <th className="bg-blue-500 text-white px-4 py-2">Specifics</th>
                        <th className="bg-blue-500 text-white px-4 py-2">Expiry Date</th>
                        <th className="bg-blue-500 text-white px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr
                            key={product.id}
                            className={isExpiringSoon(product.expiry_date) ? 'bg-yellow-100' : ''}
                        >
                            <td className="border px-4 py-2">{product.name}</td>
                            <td className="border px-4 py-2">{product.quantity}</td>
                            <td className="border px-4 py-2">{product.specifics}</td>
                            <td className="border px-4 py-2">{product.expiry_date}</td>
                            <td className="border px-4 py-2 flex gap-2">
                                <button
                                    onClick={() => onEdit(product.id)}
                                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(product.id)}
                                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;

import React, { useState, useEffect } from 'react';
const today = new Date().toISOString().slice(0, 10);

const ProductForm = ({ onSubmit, initialProduct }) => {
    const [product, setProduct] = useState({
        name: '',
        specifics: '',
        purchase_date: today,
        quantity: '',
        purchase_price: '',
        discount: '',
        mrp: '',
        expiry_date: '',
        ...(initialProduct || {}),
    });

    useEffect(() => {
        setProduct({
            name: '',
            specifics: '',
            purchase_date: (initialProduct && initialProduct.purchase_date) || today,
            quantity: '',
            purchase_price: '',
            discount: '',
            mrp: '',
            expiry_date: '',
            ...(initialProduct || {}),
        });
    }, [initialProduct]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        const numericFields = ['quantity', 'purchase_price', 'discount', 'mrp'];
        const parsedValue = numericFields.includes(id) ? parseFloat(value) || '' : value;
        setProduct(prev => ({
            ...prev,
            [id]: parsedValue,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(product);
        setProduct({
            name: '',
            specifics: '',
            purchase_date: today,
            quantity: '',
            purchase_price: '',
            discount: '',
            mrp: '',
            expiry_date: '',
        });
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded shadow">
            <input type="text" id="name" placeholder="Product Name" value={product.name} onChange={handleChange} required className="input input-bordered" />
            <input type="text" id="specifics" placeholder="Specifics" value={product.specifics} onChange={handleChange} required className="input input-bordered" />
            <input type="date" id="purchase_date" value={product.purchase_date} onChange={handleChange} required className="input input-bordered" />
            <input type="number" id="quantity" placeholder="Quantity" value={product.quantity} onChange={handleChange} required className="input input-bordered" />
            <input type="number" id="purchase_price" placeholder="Purchase Price" value={product.purchase_price} onChange={handleChange} required className="input input-bordered" />
            <input type="number" id="discount" placeholder="Discount" value={product.discount} onChange={handleChange} required className="input input-bordered" />
            <input type="number" id="mrp" placeholder="MRP" value={product.mrp} onChange={handleChange} required className="input input-bordered" />
            <input type="date" id="expiry_date" value={product.expiry_date} onChange={handleChange} required className="input input-bordered" />
            <button type="submit" className="col-span-1 md:col-span-4 mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                {initialProduct?.id ? 'Update Product' : 'Add Product'}
            </button>
        </form>
    );
};

export default ProductForm;

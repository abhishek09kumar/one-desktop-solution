import React, { useState, useEffect } from 'react';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';

const InventoryPage = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [expiringProducts, setExpiringProducts] = useState([]);
    const [showExpiring, setShowExpiring] = useState(false);

    const fetchProducts = async () => {
        const fetchedProducts = await window.electron.invoke('get-products');
        setProducts(fetchedProducts);
    };

    const fetchExpiringProducts = async () => {
        const expiring = await window.electron.invoke('get-expiring-products');
        setExpiringProducts(expiring);
        if (expiring.length > 0) setShowExpiring(true);
    };

    useEffect(() => {
        fetchProducts();
        fetchExpiringProducts();
    }, []);

    const handleAddOrEditProduct = async (product) => {
        if (editingProduct) {
            await window.electron.invoke('update-product', { ...product, id: editingProduct.id });
        } else {
            await window.electron.invoke('add-product', product);
        }
        setEditingProduct(null);
        fetchProducts();
    };

    const handleEditProduct = async (id) => {
        const product = await window.electron.invoke('get-product-by-id', id);
        setEditingProduct(product);
    };

    const handleDeleteProduct = async (id) => {
        await window.electron.invoke('delete-product', id);
        fetchProducts();
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold text-blue-700 mb-4 text-center">Inventory Management</h1>
            {showExpiring && (
                <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded shadow">
                    <strong>Notice:</strong> The following SKUs will expire in the next 30 days:
                    <ul className="list-disc ml-6 mt-2">
                        {expiringProducts.map((p) => (
                            <li key={p.id}>
                                {p.name} ({p.specifics}) - Expiry: {p.expiry_date}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <ProductForm onSubmit={handleAddOrEditProduct} initialProduct={editingProduct} />
            <ProductTable products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
        </div>
    );
};

export default InventoryPage;

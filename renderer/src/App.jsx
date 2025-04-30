import React from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import InventoryPage from './pages/InventoryPage';
import BillingPage from './pages/BillingPage';
import ReturnsPage from './pages/ReturnsPage';
import SyncData from './pages/SyncData';

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100 flex flex-col items-center">
                <h1 className="text-3xl font-bold text-blue-700 mt-8 mb-4">Welcome to One Desktop Solution</h1>
                <nav className="mb-8 flex gap-4">
                    <Link to="/inventory">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Manage Inventory</button>
                    </Link>
                    <Link to="/billing">
                        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Billing</button>
                    </Link>
                    <Link to="/returns">
                        <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">Returns</button>
                    </Link>
                    <Link to="/sync">
                        <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700 transition">Sync Data</button>
                    </Link>
                </nav>
                <div className="w-full max-w-4xl bg-white rounded shadow p-6">
                    <Routes>
                        <Route path="/inventory" element={<InventoryPage />} />
                        <Route path="/billing" element={<BillingPage />} />
                        <Route path="/returns" element={<ReturnsPage />} />
                        <Route path="/sync" element={<SyncData />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;

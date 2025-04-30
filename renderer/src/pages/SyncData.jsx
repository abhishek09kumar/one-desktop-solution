import React, { useState } from 'react';

const SyncData = () => {
    const [syncStatus, setSyncStatus] = useState('');
    const [statusType, setStatusType] = useState('info'); // info, success, error

    const handleManualSync = async () => {
        setSyncStatus('Syncing...');
        setStatusType('info');
        try {
            await window.electron.invoke('manual-sync');
            setSyncStatus('✅ Sync complete!');
            setStatusType('success');
        } catch (e) {
            setSyncStatus('❌ Sync failed!');
            setStatusType('error');
        }
    };

    const statusColor = statusType === 'success'
        ? 'text-green-700 bg-green-100 border-green-400'
        : statusType === 'error'
        ? 'text-red-700 bg-red-100 border-red-400'
        : 'text-blue-700 bg-blue-100 border-blue-400';

    return (
        <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
            <div className="flex flex-col items-center">
                <div className="mb-4">
                    <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-blue-700 mb-2 text-center">Cloud Sync</h1>
                <p className="text-gray-600 mb-6 text-center">
                    Keep your data safe and up-to-date by syncing with the cloud.
                </p>
                <button
                    className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
                    onClick={handleManualSync}
                >
                    Sync with Cloud
                </button>
                {syncStatus && (
                    <div className={`mt-6 px-4 py-2 border rounded ${statusColor} text-center font-semibold transition`}>
                        {syncStatus}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SyncData;
import React, { useState, useEffect } from 'react';
import api from '../api/api';

const HistorySidebar = ({ productId, onClose }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!productId) return;

        const fetchHistory = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/products/${productId}/history`);
                setHistory(response.data);
            } catch (error) {
                setHistory([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [productId]);

    if (!productId) return null;

    return (
        <div className="fixed top-0 right-0 w-96 h-full bg-white p-6 shadow-2xl z-50 transition-transform duration-300 transform translate-x-0 border-l border-gray-200">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Activity Log
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-3xl transition duration-150">
                    &times;
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <p className="text-indigo-500">Loading changes...</p>
                </div>
            ) : history.length === 0 ? (
                <div className="flex justify-center items-center h-48">
                    <p className="text-gray-500 text-center">No inventory changes recorded for this product.</p>
                </div>
            ) : (
                <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-100px)] pr-1">
                    {history.map((log) => {
                        const isStockIn = log.new_quantity > log.old_quantity;
                        const quantityChange = Math.abs(log.new_quantity - log.old_quantity);
                        const statusText = isStockIn ? 'Stock In' : 'Stock Out';
                        const statusClass = isStockIn ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
                        const icon = isStockIn ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                        );

                        return (
                            <div key={log.id} className={`p-4 border rounded-xl shadow-sm transition duration-150 ${statusClass}`}>
                                <div className="flex justify-between items-center mb-1">
                                    <div className={`font-semibold text-sm flex items-center ${isStockIn ? 'text-green-800' : 'text-red-800'}`}>
                                        {icon}
                                        <span className="ml-1">{statusText}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {new Date(log.change_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-gray-700 text-base">
                                    Quantity: <span className="font-bold">{quantityChange}</span> {isStockIn ? 'added' : 'removed'}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                    {log.old_quantity} &rarr; <span className="font-bold">{log.new_quantity}</span> | By: {log.user_info || 'System'}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default HistorySidebar;
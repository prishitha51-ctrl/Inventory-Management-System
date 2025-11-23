import React, { useRef, useState } from 'react';
import api from '../api/api';
import { FiMenu } from 'react-icons/fi';

const ExportModal = ({ onClose, onExportAll, onExportSelected, selectedProductIds }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Export Options</h2>
            <p className="text-sm text-gray-600 mb-6">Choose which products to export to CSV.</p>
            <div className="flex flex-col space-y-3">
                <button 
                    onClick={onExportAll} 
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-150 text-sm font-medium w-full"
                >
                    Export All Products
                </button>
                <button 
                    onClick={onExportSelected} 
                    disabled={selectedProductIds.length === 0}
                    className={`px-4 py-2 rounded-lg transition duration-150 text-sm font-medium w-full ${
                        selectedProductIds.length > 0 ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Export Selected ({selectedProductIds.length})
                </button>
                <button 
                    onClick={onClose} 
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-150 text-sm font-medium w-full"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
);

const ImportExport = ({ refreshProducts, onLogout, selectedProductIds }) => {
    const fileInputRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleImportClick = () => fileInputRef.current.click();

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('csvFile', file);
        try {
            const res = await api.post('/products/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setModalMessage(`Import Successful! Added: ${res.data.addedCount}, Skipped: ${res.data.skippedCount}`);
            setModalOpen(true);
            refreshProducts();
        } catch (error) {
            const msg = error.response?.data?.message || 'Import failed. Check CSV format.';
            setModalMessage(msg);
            setModalOpen(true);
        } finally {
            event.target.value = null;
        }
    };

    const handleExport = async (endpoint, fileName, data = null, method = 'GET') => {
        setExportModalOpen(false);
        try {
            let res;
            if (method === 'POST') {
                res = await api.post(endpoint, data, { responseType: 'blob' });
            } else {
                res = await api.get(endpoint, { responseType: 'blob' });
            }
            
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            const msg = error.response?.data?.message || 'Export failed.';
            setModalMessage(msg);
            setModalOpen(true);
        }
    };
    
    const onExportAll = () => handleExport('/products/export', 'all_products.csv');
    const onExportSelected = () => handleExport('/products/export-custom', 'selected_products.csv', { ids: selectedProductIds }, 'POST');

    return (
        <div className="relative">
            <div className="hidden md:flex space-x-2">
                <button onClick={handleImportClick} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-150 text-sm font-medium">Import CSV</button>
                <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <button onClick={() => setExportModalOpen(true)} className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-150 text-sm font-medium">Export CSV</button>
                <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-150 text-sm font-medium">Logout</button>
            </div>
            <div className="md:hidden">
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-md border border-gray-400">
                    <FiMenu size={24} />
                </button>
                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col space-y-2 p-2 z-50">
                        <button onClick={handleImportClick} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-150 text-sm font-medium">Import CSV</button>
                        <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <button onClick={() => { setMenuOpen(false); setExportModalOpen(true); }} className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-150 text-sm font-medium">Export CSV</button>
                        <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-150 text-sm font-medium">Logout</button>
                    </div>
                )}
            </div>
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
                        <p className="text-gray-800 text-sm font-medium mb-4">{modalMessage}</p>
                        <button onClick={() => setModalOpen(false)} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-150 text-sm font-medium">Close</button>
                    </div>
                </div>
            )}
            {exportModalOpen && (
                <ExportModal
                    onClose={() => setExportModalOpen(false)}
                    onExportAll={onExportAll}
                    onExportSelected={onExportSelected}
                    selectedProductIds={selectedProductIds}
                />
            )}
        </div>
    );
};

export default ImportExport;
import React, { useState } from 'react';
import api from '../api/api';

const ProductForm = ({ onSave, initialData = {}, onClose }) => {
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        unit: initialData.unit || '',
        category: initialData.category || '',
        brand: initialData.brand || '',
        stock: initialData.stock || 0,
        status: initialData.status || 'In Stock',
        image: initialData.image || '',
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const isEdit = !!initialData.id;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'stock' ? parseInt(value) : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            if (isEdit) {
                await api.put(`/products/${initialData.id}`, formData);
            } else {
                await api.post('/products', formData);
            }
            onSave(isEdit ? initialData.id : null);
        } catch (error) {
            const msg = error.response?.data?.message || 'A network or server error occurred. Check backend console.';
            setErrorMessage(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto relative border border-gray-100">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition duration-150"
                aria-label="Close"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <h3 className="text-2xl font-bold mb-6 text-center text-blue-700">
                {isEdit ? '✏️ Edit Product' : '➕ Add New Product'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full" required />
                <input name="unit" value={formData.unit} onChange={handleChange} placeholder="Unit (e.g., Pcs, Kg)" className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full" />
                <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full" />
                <input name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full" />
                <input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Stock Quantity" className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full" required />
                <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL (Optional)" className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full" />
                <select name="status" value={formData.status} onChange={handleChange} className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full sm:col-span-2 bg-white">
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Low Stock">Low Stock</option>
                </select>
                {errorMessage && <p className="col-span-1 sm:col-span-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">{errorMessage}</p>}
                <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row justify-end gap-3 mt-4">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="bg-gray-200 text-gray-800 font-medium px-6 py-2 rounded-lg hover:bg-gray-300 transition duration-150 w-full sm:w-auto order-2 sm:order-1"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-150 w-full sm:w-auto order-1 sm:order-2"
                    >
                        {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Add Product')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import api from '../api/api';
import ProductForm from './ProductForm';

const StockStatus = ({ stock }) => {
    const status = stock === 0 ? 'Out of Stock' : stock < 10 ? 'Low Stock' : 'In Stock';
    const colorClass = stock === 0 ? 'bg-red-100 text-red-700' : stock < 10 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700';
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>{status}</span>;
};

const MenuPortal = ({ children, position, onClose }) => {
    const menuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) onClose();
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);
    return ReactDOM.createPortal(
        <div
            ref={menuRef}
            style={{ position: 'absolute', top: position.top, left: position.left, zIndex: 9999 }}
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>,
        document.body
    );
};

const DeleteModal = ({ product, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Confirm Deletion</h2>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete <span className="font-medium">{product.name}</span>?</p>
            <div className="flex justify-center space-x-3">
                <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700">Cancel</button>
                <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white">Delete</button>
            </div>
        </div>
    </div>
);

const ProductRow = ({ product, refreshProducts, openEditModal, setSelectedProductId, isHistoryOpen, isSelected, toggleProductSelection }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const buttonRef = useRef(null);

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/products/${product.id}`);
            setIsDeleteModalOpen(false);
            refreshProducts();
        } catch {
            setIsDeleteModalOpen(false);
        }
    };

    const handleEditClick = () => {
        openEditModal(product);
        setMenuOpen(false);
    };

    const handleHistoryClick = () => {
        setSelectedProductId(product.id);
        setMenuOpen(false);
    };

    const toggleMenu = () => setMenuOpen((prev) => !prev);

    useEffect(() => {
        if (menuOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const menuWidth = 128;
            const horizontalCenterOffset = (menuWidth - rect.width) / 2;
            setMenuPos({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX - horizontalCenterOffset,
            });
        }
    }, [menuOpen]);

    return (
        <>
            <tr className="border-b hover:bg-gray-50">
                <td className="p-3 text-center">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleProductSelection(product.id)}
                        className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out rounded border-gray-300"
                    />
                </td>
                <td className="p-3">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-full"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/40';
                            }}
                        />
                    ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs">No Img</div>
                    )}
                </td>
                <td className="p-3 whitespace-nowrap">{product.name}</td>
                <td className="p-3 whitespace-nowrap">{product.unit}</td>
                <td className="p-3 whitespace-nowrap">{product.category}</td>
                <td className="p-3 whitespace-nowrap">{product.brand}</td>
                <td className="p-3 whitespace-nowrap">{product.stock}</td>
                <td className="p-3 whitespace-nowrap"><StockStatus stock={product.stock} /></td>
                <td className="py-3 px-1 relative text-center">
                    <div className="flex justify-center items-center w-full h-full">
                        <button
                            ref={buttonRef}
                            onClick={toggleMenu}
                            className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                            </svg>
                        </button>
                    </div>
                    {menuOpen && (
                        <MenuPortal position={menuPos} onClose={() => setMenuOpen(false)}>
                            <div className="w-32 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                                <button
                                    onClick={handleEditClick}
                                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleHistoryClick}
                                    className={`block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 ${
                                        isHistoryOpen ? 'bg-indigo-100 text-indigo-700' : ''
                                    }`}
                                >
                                    History
                                </button>
                                <button
                                    onClick={() => {
                                        setIsDeleteModalOpen(true);
                                        setMenuOpen(false);
                                    }}
                                    className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    Delete
                                </button>
                            </div>
                        </MenuPortal>
                    )}
                </td>
            </tr>
            {isDeleteModalOpen && (
                <DeleteModal
                    product={product}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setIsDeleteModalOpen(false)}
                />
            )}
        </>
    );
};

const ProductTable = ({
    products,
    refreshProducts,
    totalPages,
    currentPage,
    setPage,
    setSort,
    sortField,
    sortOrder,
    setSelectedProductId,
    isHistoryOpen,
    selectedProductIds,
    toggleProductSelection,
    toggleSelectAll,
}) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editProductData, setEditProductData] = useState(null);

    const openEditModal = (product) => {
        setEditProductData(product);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = (productId) => {
        refreshProducts();
        setIsEditModalOpen(false);
        setEditProductData(null);
        if (productId) setSelectedProductId(productId);
    };

    const handleSort = (field) => {
        const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSort(field, newOrder);
    };

    const renderSortIndicator = (field) => {
        if (sortField !== field) return null;
        return sortOrder === 'asc' ? ' ⬆' : ' ⬇';
    };

    const productIdsOnPage = products.map(p => p.id);
    const allOnPageSelected = productIdsOnPage.every(id => selectedProductIds.includes(id));
    const isIndeterminate = !allOnPageSelected && productIdsOnPage.some(id => selectedProductIds.includes(id));

    const paginationButtons = [];
    const maxPageButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
    if (endPage - startPage + 1 < maxPageButtons) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    if (startPage > 1) {
        paginationButtons.push(<button key={1} onClick={() => setPage(1)} className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300">1...</button>);
    }

    for (let page = startPage; page <= endPage; page++) {
        paginationButtons.push(
            <button
                key={page}
                onClick={() => setPage(page)}
                className={`px-3 py-1 text-sm rounded ${
                    currentPage === page ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
                {page}
            </button>
        );
    }
    
    if (endPage < totalPages) {
        paginationButtons.push(<button key={totalPages} onClick={() => setPage(totalPages)} className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300">...{totalPages}</button>);
    }


    return (
        <div className="bg-white p-4 rounded-lg shadow-md mt-4 overflow-x-auto">
            <table className="min-w-full table-auto relative">
                <thead>
                    <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
                        <th className="p-3 w-10 text-center">
                             <input
                                type="checkbox"
                                checked={allOnPageSelected}
                                onChange={() => toggleSelectAll(productIdsOnPage)}
                                ref={el => el && (el.indeterminate = isIndeterminate)}
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out rounded border-gray-300"
                            />
                        </th>
                        {['Image', 'Name', 'Unit', 'Category', 'Brand', 'Stock', 'Status', 'Actions'].map((header) => (
                            <th
                                key={header}
                                className={`p-3 cursor-pointer ${header === 'Actions' ? 'pr-1' : ''}`}
                                onClick={() => handleSort(header.toLowerCase().replace(' ', '_'))}
                            >
                                {header}
                                {renderSortIndicator(header.toLowerCase().replace(' ', '_'))}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan="9" className="p-4 text-center text-gray-500">
                                No products found.
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <ProductRow
                                key={product.id}
                                product={product}
                                refreshProducts={refreshProducts}
                                openEditModal={openEditModal}
                                setSelectedProductId={setSelectedProductId}
                                isHistoryOpen={isHistoryOpen && product.id === setSelectedProductId}
                                isSelected={selectedProductIds.includes(product.id)}
                                toggleProductSelection={toggleProductSelection}
                            />
                        ))
                    )}
                </tbody>
            </table>
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm rounded bg-gray-200 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        {paginationButtons}
                        <button
                            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm rounded bg-gray-200 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <ProductForm
                        initialData={editProductData}
                        onSave={handleSaveEdit}
                        onClose={() => setIsEditModalOpen(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductTable;
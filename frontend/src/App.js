import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import api from './api/api';
import ProductTable from './components/ProductTable';
import ImportExport from './components/ImportExport';
import HistorySidebar from './components/HistorySidebar';
import AuthWrapper from './components/AuthWrapper';
import ProductForm from './components/ProductForm';
import LandingPage from './components/LandingPage';

const Dashboard = ({ isAuthenticated, setIsAuthenticated }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sort, setSort] = useState({ field: 'id', order: 'asc' });
    const [selectedProductIds, setSelectedProductIds] = useState([]);

    const fetchProducts = useCallback(async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const params = { page: currentPage, sort: sort.field, order: sort.order, category: selectedCategory, name: searchQuery };
            const response = await api.get('/products', { params });
            setProducts(response.data.products);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
            const uniqueCategories = [...new Set(response.data.products.map(p => p.category).filter(c => c))];
            setCategories(['All', ...uniqueCategories]);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            }
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, currentPage, sort, selectedCategory, searchQuery, setIsAuthenticated]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSortChange = (field, order) => { setSort({ field, order }); setCurrentPage(1); };
    const handleCategoryChange = (e) => { setSelectedCategory(e.target.value === 'All' ? '' : e.target.value); setCurrentPage(1); };
    const handleSearch = (e) => { setSearchQuery(e.target.value); setCurrentPage(1); };
    const handleLogout = () => { localStorage.removeItem('token'); setIsAuthenticated(false); };
    const handleAddSave = (editedId) => { fetchProducts(); setIsAddModalOpen(false); if (editedId) setSelectedProductId(editedId); };
    
    const toggleProductSelection = (id) => {
        setSelectedProductIds(prev =>
            prev.includes(id) ? prev.filter(productId => productId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = (idsOnPage) => {
        const allOnPageSelected = idsOnPage.every(id => selectedProductIds.includes(id));
        if (allOnPageSelected) {
            setSelectedProductIds(prev => prev.filter(id => !idsOnPage.includes(id)));
        } else {
            setSelectedProductIds(prev => [...new Set([...prev, ...idsOnPage])]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            <div className={`p-4 md:p-6 transition-all duration-300 ${selectedProductId ? 'md:w-3/4 w-full' : 'w-full'}`}>
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Inventory Dashboard</h1>
                    <ImportExport 
                        refreshProducts={fetchProducts} 
                        onLogout={handleLogout} 
                        selectedProductIds={selectedProductIds}
                    />
                </header>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-4 rounded-lg shadow mb-4 space-y-3 md:space-y-0 md:space-x-3">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="p-2 border border-gray-300 rounded-lg w-full sm:w-60"
                        />
                        <select
                            value={selectedCategory || 'All'}
                            onChange={handleCategoryChange}
                            className="p-2 border border-gray-300 rounded-lg w-full sm:w-auto bg-white"
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={() => { setIsAddModalOpen(true); setSelectedProductId(null); }}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-150 text-sm font-medium w-full md:w-auto"
                    >
                        + Add New Product
                    </button>
                </div>
                {loading ? (
                    <div className="text-center p-8 text-gray-500">Loading products...</div>
                ) : (
                    <ProductTable
                        products={products}
                        refreshProducts={fetchProducts}
                        totalPages={totalPages}
                        currentPage={currentPage}
                        setPage={setCurrentPage}
                        setSort={handleSortChange}
                        sortField={sort.field}
                        sortOrder={sort.order}
                        setSelectedProductId={setSelectedProductId}
                        isHistoryOpen={!!selectedProductId}
                        selectedProductIds={selectedProductIds}
                        toggleProductSelection={toggleProductSelection}
                        toggleSelectAll={toggleSelectAll}
                    />
                )}
            </div>
            <HistorySidebar productId={selectedProductId} onClose={() => setSelectedProductId(null)} />
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <ProductForm onSave={handleAddSave} onClose={() => setIsAddModalOpen(false)} />
                </div>
            )}
        </div>
    );
};

const TitleUpdater = () => {
    const location = useLocation();

    useEffect(() => {
        let titleSuffix = " | Inventory IMS";
        let pageName = "";
        
        switch (location.pathname) {
            case '/':
                pageName = "Home";
                break;
            case '/login':
                pageName = "Login/Register";
                break;
            case '/dashboard':
                pageName = "Dashboard";
                break;
            default:
                pageName = "404 Not Found";
                titleSuffix = ""; 
                break;
        }
        document.title = pageName + titleSuffix;
    }, [location.pathname]);

    return null; 
};

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    
    return (
        <Router>
            <TitleUpdater />
            <Routes>
                <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthWrapper setIsAuthenticated={setIsAuthenticated} />}
                />
                <Route
                    path="/dashboard"
                    element={isAuthenticated ? <Dashboard isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
                />
                <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
            </Routes>
        </Router>
    );
};

export default App;

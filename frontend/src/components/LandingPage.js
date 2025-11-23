import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 antialiased">
            <header className="bg-white shadow-lg sticky top-0 z-50">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <span className="text-3xl text-teal-600">📦</span>
                        <h1 className="text-2xl font-extrabold text-gray-900">InventoryPro</h1>
                    </div>
                    <Link to="/dashboard" className="px-5 py-2 text-white bg-teal-600 rounded-full shadow-md hover:bg-teal-700 transition duration-300 font-semibold text-sm transform hover:scale-105">
                        Go to Dashboard
                    </Link>
                </nav>
            </header>

            <section className="relative py-32 overflow-hidden bg-gradient-to-br from-teal-50 to-white" id="hero">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-6xl font-black text-gray-900 mb-6 tracking-tight sm:text-7xl">
                        Precision Inventory,<br /> Effortless Management.
                    </h2>
                    <p className="text-xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
                        InventoryPro is the intelligent platform designed to track stock in real-time, predict needs, and streamline your entire product lifecycle with ease.
                    </p>
                    <Link to="/dashboard" className="inline-block px-12 py-4 text-lg font-bold text-white bg-teal-600 rounded-full shadow-2xl shadow-teal-500/50 hover:bg-teal-700 transition duration-300 transform hover:translate-y-0.5 hover:shadow-lg">
                        Start Managing Now
                    </Link>
                </div>
            </section>

            <section className="py-20" id="features">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h3 className="text-4xl font-extrabold text-center text-gray-900 mb-16">Features That Drive Efficiency</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition duration-500 transform hover:-translate-y-1">
                            <div className="mb-4 text-teal-600 text-5xl">⏱️</div>
                            <h4 className="text-2xl font-bold mb-3 text-gray-800">Real-Time Tracking</h4>
                            <p className="text-gray-600">Instantly monitor stock levels and movement across all locations from a single, intuitive dashboard.</p>
                        </div>
                        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition duration-500 transform hover:-translate-y-1">
                            <div className="mb-4 text-orange-500 text-5xl">📈</div>
                            <h4 className="text-2xl font-bold mb-3 text-gray-800">Insightful Analytics</h4>
                            <p className="text-gray-600">Access powerful reports and forecasts to make informed purchasing and sales decisions.</p>
                        </div>
                        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition duration-500 transform hover:-translate-y-1">
                            <div className="mb-4 text-purple-600 text-5xl">📱</div>
                            <h4 className="text-2xl font-bold mb-3 text-gray-800">Mobile Ready</h4>
                            <p className="text-gray-600">Manage and update your inventory on the go with our fully responsive design on any device.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-teal-600" id="cta-bottom">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-4xl font-extrabold text-white mb-4">Ready to Optimize Your Inventory?</h3>
                    <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
                        Join businesses that are saving time and money by mastering their stock with InventoryPro.
                    </p>
                    <Link to="/dashboard" className="inline-block px-10 py-3 text-lg font-bold text-teal-600 bg-white rounded-full shadow-lg hover:bg-gray-100 transition duration-300">
                        Get Started Today
                    </Link>
                </div>
            </section>

            <footer className="py-12 bg-gray-900" id="contact">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-400 font-medium">© 2024 InventoryPro. All rights reserved.</p>
                    <div className="mt-4 space-x-6">
                        <a href="#privacy" className="text-gray-400 hover:text-teal-400 text-sm transition duration-150">Privacy Policy</a>
                        <a href="#terms" className="text-gray-400 hover:text-teal-400 text-sm transition duration-150">Terms of Service</a>
                        <a href="#support" className="text-gray-400 hover:text-teal-400 text-sm transition duration-150">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
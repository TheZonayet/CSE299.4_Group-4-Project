import React, { useState, useEffect } from 'react';
import { Home, History, User, Lock, MapPin, LogOut, CheckCircle, XCircle } from 'lucide-react';

// Mock data and API configuration
const API_BASE_URL = 'http://localhost:3001/api';

// Main App Component
const App = () => {
  const [companyName, setCompanyName] = useState('');
  const [barCode, setBarCode] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');

  // Utility function for exponential backoff retry logic
  const fetchWithRetry = async (url, options, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error(`Attempt ${i + 1} failed:`, error);
        if (i < retries - 1) {
          const delay = Math.pow(2, i) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw error;
        }
      }
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setVerificationResult(null);

    // Minimal validation
    if (!companyName && !barCode && !batchNo) {
      setVerificationResult({ success: false, message: 'Please enter at least one search criterion.' });
      setLoading(false);
      return;
    }

    try {
      const result = await fetchWithRetry(`${API_BASE_URL}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyName, barCode, batchNo }),
      });

      setVerificationResult(result);

    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationResult({ success: false, message: 'Could not connect to the verification service. Ensure the server is running.' });
    } finally {
      setLoading(false);
    }
  };

  // Component to display the verification status
  const VerificationStatus = ({ result }) => {
    if (!result) return null;

    const Icon = result.success ? CheckCircle : XCircle;
    const colorClass = result.success ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-red-500/10 border-red-500 text-red-500';
    const title = result.success ? 'Verification Successful' : 'Verification Failed';

    return (
      <div className={`p-4 mt-6 border rounded-lg transition-all duration-300 ${colorClass}`}>
        <div className="flex items-center space-x-3">
          <Icon size={24} />
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <p className="mt-2 text-sm">{result.message}</p>
        {result.artifact && (
          <div className="mt-3 text-xs text-gray-300">
            <p className="font-medium">Artifact Details:</p>
            <p>Issuer: {result.artifact.companyName}</p>
            <p>Hash: {result.artifact.blockchainHash}</p>
            <p>Status: {result.artifact.status}</p>
            <p>Issue Date: {new Date(result.artifact.dateIssued).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    );
  };


  // Component for the navigation item
  const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
    <div
      className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-colors duration-200 ${
        isActive ? 'bg-teal-700/50 text-white shadow-lg' : 'text-gray-300 hover:bg-teal-700/20'
      }`}
      onClick={onClick}
    >
      <Icon size={20} className="mr-3" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );

  const navItems = [
    { icon: Home, label: 'Home', tab: 'Home' },
    { icon: History, label: 'Verification History', tab: 'History' },
    { icon: User, label: 'Account Status', tab: 'Account' },
    { icon: Lock, label: 'Verification Limits', tab: 'Limits' },
    { icon: MapPin, label: 'Verification locations', tab: 'Locations' },
  ];

  return (
    <div className="min-h-screen bg-[#07303E] text-white p-4 font-inter">
      {/* Main Window Container */}
      <div className="flex h-[90vh] max-h-[900px] max-w-6xl mx-auto rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm bg-[#0A3D50]/80 border border-teal-800/50">

        {/* Left Sidebar */}
        <div className="w-1/4 min-w-[240px] p-6 flex flex-col justify-between border-r border-teal-800/50">
          <div className="flex flex-col items-center">
            {/* Logo Section - SIDEBAR (Updated with placeholder) */}
            <div className="mb-8 p-4 rounded-2xl bg-teal-900/50 shadow-inner shadow-teal-900/80">
                <div className="w-24 h-24 bg-cover bg-center rounded-full"
                  style={{
                    // Placeholder for a generic university crest icon
                    backgroundImage: 'url(https://placehold.co/96x96/1D5E69/FFFFFF?text=NSU+Crest&font=roboto)',
                    boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)'
                  }}
                  title="North South University Crest"
                ></div>
            </div>

            <button className="w-full text-center py-2.5 mb-8 rounded-xl bg-[#2D8399] hover:bg-[#1D5E69] transition-colors duration-200 font-semibold shadow-md">
              View Points
            </button>

            {/* Navigation Links */}
            <nav className="w-full space-y-2">
              {navItems.map(item => (
                <NavItem
                  key={item.tab}
                  icon={item.icon}
                  label={item.label}
                  isActive={activeTab === item.tab}
                  onClick={() => setActiveTab(item.tab)}
                />
              ))}
            </nav>
          </div>

          {/* Account/Logout Section */}
          <div className="flex justify-between items-center space-x-2 mt-auto pt-6 border-t border-teal-800/50">
            <button className="flex-1 flex items-center justify-center p-3 rounded-xl bg-teal-700 hover:bg-teal-600 transition-colors duration-200 font-medium text-sm">
              <User size={18} className="mr-2" />
              My account
            </button>
            <button className="p-3 rounded-xl bg-teal-800 hover:bg-red-700 transition-colors duration-200">
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header Bar */}
          <header className="p-6 bg-teal-800/70 border-b border-teal-700/50">
            <h1 className="text-2xl font-bold text-center tracking-wider">
              Tutorial Certification Verification
            </h1>
          </header>

          {/* Verification Form Area */}
          <main className="flex-1 p-10 bg-[#07303E]/50 overflow-y-auto">
            <div className="max-w-xl mx-auto">
                <div className="mb-10 flex justify-center">
                    {/* Logo/Icon on Main Panel (Updated with placeholder) */}
                    <div className="w-36 h-36 p-6 rounded-3xl bg-teal-900/50 shadow-inner shadow-teal-900/80">
                        <div className="w-full h-full bg-cover bg-center rounded-full"
                          style={{
                            // Placeholder for a generic university crest icon
                            backgroundImage: 'url(https://placehold.co/100x100/1D5E69/FFFFFF?text=NSU+Crest&font=roboto)',
                            boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)'
                          }}
                          title="North South University Crest"
                        ></div>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="space-y-6">
                    {/* Input Field: Company Name */}
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium mb-1 text-gray-300">Company Name</label>
                        <input
                            id="companyName"
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full p-3 rounded-lg bg-white/10 border border-teal-700/50 focus:border-teal-400 focus:ring focus:ring-teal-400/50 transition-all text-white placeholder-gray-400"
                            placeholder="Enter Company Name"
                            disabled={loading}
                        />
                    </div>

                    {/* Input Field: Bar Code */}
                    <div>
                        <label htmlFor="barCode" className="block text-sm font-medium mb-1 text-gray-300">Bar Code</label>
                        <input
                            id="barCode"
                            type="text"
                            value={barCode}
                            onChange={(e) => setBarCode(e.target.value)}
                            className="w-full p-3 rounded-lg bg-white/10 border border-teal-700/50 focus:border-teal-400 focus:ring focus:ring-teal-400/50 transition-all text-white placeholder-gray-400"
                            placeholder="Enter Bar Code"
                            disabled={loading}
                        />
                    </div>

                    {/* Input Field: Batch No. */}
                    <div>
                        <label htmlFor="batchNo" className="block text-sm font-medium mb-1 text-gray-300">Batch No.</label>
                        <input
                            id="batchNo"
                            type="text"
                            value={batchNo}
                            onChange={(e) => setBatchNo(e.target.value)}
                            className="w-full p-3 rounded-lg bg-white/10 border border-teal-700/50 focus:border-teal-400 focus:ring focus:ring-teal-400/50 transition-all text-white placeholder-gray-400"
                            placeholder="Enter Batch No."
                            disabled={loading}
                        />
                    </div>

                    {/* Search Button & QR Code Link */}
                    <div className="flex flex-col items-center pt-4">
                        <button
                            type="submit"
                            className={`w-48 py-3 rounded-full font-bold text-lg transition-all duration-300 shadow-lg ${
                                loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                            disabled={loading}
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                        <a href="#" className="mt-4 text-sm text-blue-400 hover:underline">
                            Search via QR code
                        </a>
                    </div>
                </form>

                {/* Verification Status Area */}
                <VerificationStatus result={verificationResult} />

            </div>
          </main>

          {/* Footer Bar */}
          <footer className="p-4 bg-teal-800/70 border-t border-teal-700/50 flex justify-center space-x-10 text-xs text-gray-300">
            <a href="#" className="hover:text-white">Terms & Conditions</a>
            <a href="#" className="hover:text-white">Credits</a>
            <div className="text-teal-400">© 2024 Asure</div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default App;
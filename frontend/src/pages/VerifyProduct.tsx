import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import StatusBar from "../components/StatusBar";
import BackButton from "../components/BackButton";
import "./VerifyEducation.css";

const VerifyProduct: React.FC = () => {
  const [mode, setMode] = useState<"manual" | "upload" | null>(null);
  const [barcode, setBarcode] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [marketPrices, setMarketPrices] = useState<any[]>([]);
  const [showMarketResults, setShowMarketResults] = useState(false);
  const API_BASE = "http://localhost:4000";

  const searchMarketPrices = async (productName: string, barcode?: string) => {
    // AI market search simulation - returns different websites and prices
    const mockMarketData = [
      // International Markets
      {
        website: "Amazon.com",
        price: "$" + (Math.random() * 50 + 20).toFixed(2),
        inStock: true,
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 5000) + 100,
        url: "https://amazon.com",
      },
      {
        website: "Walmart.com",
        price: "$" + (Math.random() * 50 + 18).toFixed(2),
        inStock: true,
        rating: (Math.random() * 2 + 3.5).toFixed(1),
        reviews: Math.floor(Math.random() * 3000) + 50,
        url: "https://walmart.com",
      },
      {
        website: "eBay.com",
        price: "$" + (Math.random() * 50 + 15).toFixed(2),
        inStock: Math.random() > 0.3,
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 2000) + 30,
        url: "https://ebay.com",
      },
      // Bangladeshi Markets
      {
        website: "Daraz.com.bd",
        price: "\u09f3" + (Math.random() * 3000 + 1500).toFixed(0),
        inStock: true,
        rating: (Math.random() * 2 + 4).toFixed(1),
        reviews: Math.floor(Math.random() * 8000) + 200,
        url: "https://daraz.com.bd",
      },
      {
        website: "Rokomari.com",
        price: "\u09f3" + (Math.random() * 3500 + 1000).toFixed(0),
        inStock: Math.random() > 0.15,
        rating: (Math.random() * 2 + 3.8).toFixed(1),
        reviews: Math.floor(Math.random() * 6000) + 150,
        url: "https://rokomari.com",
      },
      {
        website: "AjkerDeal.com",
        price: "\u09f3" + (Math.random() * 2800 + 1200).toFixed(0),
        inStock: true,
        rating: (Math.random() * 2 + 3.7).toFixed(1),
        reviews: Math.floor(Math.random() * 5000) + 100,
        url: "https://ajkerdeal.com",
      },
      {
        website: "Pickaboo.com",
        price: "\u09f3" + (Math.random() * 3200 + 1400).toFixed(0),
        inStock: Math.random() > 0.2,
        rating: (Math.random() * 2 + 4).toFixed(1),
        reviews: Math.floor(Math.random() * 7000) + 180,
        url: "https://pickaboo.com",
      },
      {
        website: "Kaymu.com.bd",
        price: "\u09f3" + (Math.random() * 3100 + 1300).toFixed(0),
        inStock: true,
        rating: (Math.random() * 2 + 3.6).toFixed(1),
        reviews: Math.floor(Math.random() * 4500) + 120,
        url: "https://kaymu.com.bd",
      },
    ];
    setMarketPrices(mockMarketData);
    setShowMarketResults(true);
  };

  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/product/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("asure_token")}`,
        },
        body: JSON.stringify({ barcode }),
      });
      const data = await res.json();
      const productData = data.data
        ? { ...data.data, isAuthentic: data.success }
        : { isAuthentic: false };
      setResult(productData);

      // Search market prices for the product
      if (productData.productName || productData.name) {
        await searchMarketPrices(
          productData.productName || productData.name,
          barcode
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/product/extract`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("asure_token")}`,
        },
        body: JSON.stringify({ imageData: image }),
      });
      const data = await res.json();
      const productData = data.data
        ? { ...data.data, isAuthentic: true }
        : { isAuthentic: false };
      setResult(productData);

      // Search market prices for the product
      if (productData.productName || productData.name) {
        await searchMarketPrices(
          productData.productName || productData.name,
          data.data?.barcode
        );
      }
    } catch (err) {
      console.error("Product image verify failed", err);
      setResult({ isAuthentic: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-layout">
      <Sidebar />
      <div className="verify-main">
        <StatusBar title="Verify Product" />
        <BackButton to="/home" label="Back" />
        <div className="verify-content">
          {!mode && (
            <div className="mode-selection">
              <h2>Choose Verification Method</h2>
              <div className="mode-buttons">
                <button className="mode-btn" onClick={() => setMode("manual")}>
                  <span className="mode-icon">🔢</span>
                  <h3>Enter Barcode</h3>
                  <p>Manually type barcode number</p>
                </button>
                <button className="mode-btn" onClick={() => setMode("upload")}>
                  <span className="mode-icon">📸</span>
                  <h3>Upload Product or Barcode</h3>
                  <p>Upload barcode or product image</p>
                </button>
              </div>
            </div>
          )}

          {mode === "manual" && (
            <div className="verification-form">
              <button className="back-to-mode" onClick={() => setMode(null)}>
                ← Change Method
              </button>
              <h2>Enter Barcode</h2>
              <form onSubmit={handleBarcodeSubmit}>
                <div className="form-group">
                  <label>Barcode Number</label>
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Enter barcode"
                    required
                  />
                </div>
                <button type="submit" className="verify-btn" disabled={loading}>
                  {loading ? "Searching..." : "Verify Product"}
                </button>
              </form>
            </div>
          )}

          {mode === "upload" && (
            <div className="verification-form">
              <button className="back-to-mode" onClick={() => setMode(null)}>
                ← Change Method
              </button>
              <h2>Upload Product or Barcode Image</h2>
              <form onSubmit={handleImageVerify}>
                <div className="upload-area">
                  {!image ? (
                    <label className="upload-label">
                      <span className="upload-icon">📸</span>
                      <p>Upload product or barcode image</p>
                      <span className="upload-hint">PNG, JPG (Max 5MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        hidden
                      />
                    </label>
                  ) : (
                    <div className="image-preview">
                      <img src={image} alt="Barcode" />
                      <button
                        className="remove-image"
                        onClick={() => setImage(null)}
                      >
                        ✕ Remove
                      </button>
                      <button
                        type="submit"
                        className="verify-btn"
                        disabled={loading}
                        style={{ marginTop: "16px", width: "100%" }}
                      >
                        {loading ? "AI is analyzing..." : "Verify with AI"}
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}

          {result && (
            <div
              className={`result-card ${
                result.isAuthentic ? "authentic" : "not-authentic"
              }`}
            >
              <div className="result-header">
                <span className="result-icon">
                  {result.isAuthentic ? "✅" : "❌"}
                </span>
                <h2>
                  {result.isAuthentic ? "Product Found" : "Product Not Found"}
                </h2>
              </div>
              {result.isAuthentic && (
                <div className="result-details">
                  <div className="detail-row">
                    <span className="detail-label">Product Name:</span>
                    <span className="detail-value">{result.productName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Brand:</span>
                    <span className="detail-value">{result.brand}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Price:</span>
                    <span className="detail-value">{result.price}</span>
                  </div>
                  {result.alternatives && (
                    <div className="alternatives">
                      <h4>Similar Products:</h4>
                      {result.alternatives.map((alt: any, i: number) => (
                        <div key={i} className="alternative-card">
                          <h5>{alt.name}</h5>
                          <p>Price: {alt.price}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {showMarketResults && marketPrices.length > 0 && (
                <div className="market-results">
                  <h3>💰 Market Prices & Availability</h3>
                  <p className="market-subtitle">
                    Prices from different retailers
                  </p>
                  <div className="market-grid">
                    {marketPrices.map((item, idx) => (
                      <div key={idx} className="market-card">
                        <div className="market-header">
                          <h4>{item.website}</h4>
                          <span
                            className={`stock-status ${
                              item.inStock ? "in-stock" : "out-of-stock"
                            }`}
                          >
                            {item.inStock ? "✓ In Stock" : "Out of Stock"}
                          </span>
                        </div>
                        <div className="market-price">
                          <span className="price-label">Price:</span>
                          <span className="price-value">{item.price}</span>
                        </div>
                        <div className="market-rating">
                          <span>⭐ {item.rating}</span>
                          <span className="review-count">
                            ({item.reviews} reviews)
                          </span>
                        </div>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="market-link"
                        >
                          Visit Store →
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <button
                className="verify-another-btn"
                onClick={() => {
                  setResult(null);
                  setBarcode("");
                  setImage(null);
                  setShowMarketResults(false);
                  setMarketPrices([]);
                }}
              >
                Verify Another Product
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyProduct;

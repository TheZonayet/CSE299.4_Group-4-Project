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

  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/verify-product`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("asure_token")}`,
          },
          body: JSON.stringify({ barcode }),
        }
      );
      setResult(await res.json());
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
                  <h3>Scan Barcode</h3>
                  <p>Upload barcode image</p>
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
              <h2>Upload Barcode Image</h2>
              <div className="upload-area">
                {!image ? (
                  <label className="upload-label">
                    <span className="upload-icon">📦</span>
                    <p>Upload barcode image</p>
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
                  </div>
                )}
              </div>
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
              <button
                className="verify-another-btn"
                onClick={() => {
                  setResult(null);
                  setBarcode("");
                  setImage(null);
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

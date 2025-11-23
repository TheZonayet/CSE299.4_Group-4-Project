import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import StatusBar from "../components/StatusBar";
import BackButton from "../components/BackButton";
import "./VerifyEducation.css";

const VerifyTutorial: React.FC = () => {
  const [mode, setMode] = useState<"manual" | "upload" | null>(null);
  const [id, setId] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/verify-tutorial`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("asure_token")}`,
          },
          body: JSON.stringify({ id }),
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
        <StatusBar title="Verify Tutorial Certificate" />
        <BackButton to="/home" label="Back" />
        <div className="verify-content">
          {!mode && (
            <div className="mode-selection">
              <h2>Choose Verification Method</h2>
              <div className="mode-buttons">
                <button className="mode-btn" onClick={() => setMode("manual")}>
                  <span className="mode-icon">📝</span>
                  <h3>Enter ID</h3>
                  <p>Manually enter certificate ID</p>
                </button>
                <button className="mode-btn" onClick={() => setMode("upload")}>
                  <span className="mode-icon">📸</span>
                  <h3>Upload Certificate</h3>
                  <p>AI will scan the certificate</p>
                </button>
              </div>
            </div>
          )}

          {mode === "manual" && (
            <div className="verification-form">
              <button className="back-to-mode" onClick={() => setMode(null)}>
                ← Change Method
              </button>
              <h2>Enter Certificate ID</h2>
              <form onSubmit={handleManualSubmit}>
                <div className="form-group">
                  <label>Certificate ID</label>
                  <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="Enter ID number"
                    required
                  />
                </div>
                <button type="submit" className="verify-btn" disabled={loading}>
                  {loading ? "Verifying..." : "Verify Certificate"}
                </button>
              </form>
            </div>
          )}

          {mode === "upload" && (
            <div className="verification-form">
              <button className="back-to-mode" onClick={() => setMode(null)}>
                ← Change Method
              </button>
              <h2>Upload Certificate Image</h2>
              <div className="upload-area">
                {!image ? (
                  <label className="upload-label">
                    <span className="upload-icon">📜</span>
                    <p>Upload certificate image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      hidden
                    />
                  </label>
                ) : (
                  <div className="image-preview">
                    <img src={image} alt="Certificate" />
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
                  {result.isAuthentic
                    ? "Certificate is Authentic"
                    : "Certificate Not Found"}
                </h2>
              </div>
              {result.isAuthentic && (
                <div className="result-details">
                  <div className="detail-row">
                    <span className="detail-label">Student Name:</span>
                    <span className="detail-value">{result.studentName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Institute:</span>
                    <span className="detail-value">{result.instituteName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">License Number:</span>
                    <span className="detail-value">{result.licenseNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Skill:</span>
                    <span className="detail-value">{result.skill}</span>
                  </div>
                  {result.youtubeRecommendations && (
                    <div className="youtube-section">
                      <h4>📺 Related YouTube Tutorials:</h4>
                      {result.youtubeRecommendations.map(
                        (video: any, i: number) => (
                          <div key={i} className="youtube-card">
                            <h5>{video.title}</h5>
                            <a
                              href={video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Watch on YouTube
                            </a>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}
              <button
                className="verify-another-btn"
                onClick={() => {
                  setResult(null);
                  setId("");
                  setImage(null);
                }}
              >
                Verify Another Certificate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyTutorial;

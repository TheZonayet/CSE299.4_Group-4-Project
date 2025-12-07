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
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/tutorial/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("asure_token")}`,
        },
        body: JSON.stringify({ certificateId: id }),
      });
      const result = await res.json();
      console.log(
        "Tutorial verification response:",
        result,
        "status:",
        res.status
      );

      // Handle error responses
      if (res.status === 403) {
        setResult({
          isAuthentic: false,
          message: result.error || "Insufficient credits",
        });
      } else if (res.status === 401) {
        setResult({
          isAuthentic: false,
          message: "Authentication failed. Please log in again.",
        });
      } else if (result.success && result.data) {
        setResult({
          isAuthentic: result.data.isAuthentic,
          ...result.data,
        });
      } else {
        setResult({
          isAuthentic: false,
          message: result.message || "Certificate not found",
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      setResult({
        isAuthentic: false,
        message: "Network error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("Image loaded successfully");
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageVerification = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:4000/api/ai/analyze-certificate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("asure_token")}`,
          },
          body: JSON.stringify({
            image: image,
            certificateType: "tutorial",
          }),
        }
      );

      const aiResult = await response.json();
      if (aiResult.success && aiResult.data.analysis) {
        setResult({
          isAuthentic: true,
          studentName: "AI Analysis",
          message: aiResult.data.analysis,
          aiAnalysis: aiResult.data,
        });
      } else {
        setResult({
          isAuthentic: false,
          message:
            aiResult.data?.analysis || "Could not read certificate information",
        });
      }
    } catch (error) {
      console.error("Image verification error:", error);
      setResult({ isAuthentic: false });
    } finally {
      setLoading(false);
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
                    <div style={{ marginTop: "16px" }}>
                      <button
                        type="button"
                        className="verify-btn"
                        onClick={handleImageVerification}
                        disabled={loading}
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                        }}
                      >
                        {loading
                          ? "🔄 AI is analyzing..."
                          : "✅ Verify with AI"}
                      </button>
                    </div>
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
                  {result.message && (
                    <div className="ai-analysis-text">
                      <h4>AI Certificate Analysis:</h4>
                      <pre
                        style={{
                          whiteSpace: "pre-wrap",
                          fontFamily: "inherit",
                          color: "#000",
                          lineHeight: "1.6",
                        }}
                      >
                        {displayedText}
                        {isTyping && <span className="typing-cursor">|</span>}
                      </pre>
                    </div>
                  )}

                  {result.studentName && !result.message && (
                    <>
                      <div className="detail-row">
                        <span className="detail-label">Student Name:</span>
                        <span className="detail-value">
                          {result.studentName}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Institute:</span>
                        <span className="detail-value">
                          {result.instituteName}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">License Number:</span>
                        <span className="detail-value">
                          {result.licenseNumber}
                        </span>
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
                    </>
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

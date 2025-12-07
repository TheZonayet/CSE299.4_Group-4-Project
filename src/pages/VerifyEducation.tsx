import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StatusBar from "../components/StatusBar";
import BackButton from "../components/BackButton";
import "./VerifyEducation.css";

interface VerificationResult {
  isAuthentic: boolean;
  instituteName?: string;
  eiinNumber?: string;
  studentName?: string;
  roll?: string;
  id?: string;
  grade?: string;
  gradeDetails?: any;
}

const VerifyEducation: React.FC = () => {
  const navigate = useNavigate();
  const [verificationMode, setVerificationMode] = useState<
    "manual" | "upload" | null
  >(null);
  const [roll, setRoll] = useState("");
  const [id, setId] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleManualVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Call backend API to verify with roll and ID
      const response = await fetch(
        "http://localhost:4000/api/education/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("asure_token")}`,
          },
          body: JSON.stringify({ rollNumber: roll, idNumber: id }),
        }
      );

      const result = await response.json();
      console.log(
        "Education verification response:",
        result,
        "status:",
        response.status
      );

      // Handle error responses
      if (response.status === 403) {
        setResult({
          isAuthentic: false,
          message: result.error || "Insufficient credits",
        });
      } else if (response.status === 401) {
        setResult({
          isAuthentic: false,
          message: "Authentication failed. Please log in again.",
        });
      } else if (result.success && result.data) {
        setResult({
          isAuthentic: result.data.isAuthentic,
          instituteName: result.data.instituteName,
          eiinNumber: result.data.eiinNumber,
          studentName: result.data.studentName,
          roll: result.data.rollNumber,
          id: result.data.idNumber,
          grade: result.data.cgpa,
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

  const handleImageVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedImage) return;

    setLoading(true);
    setResult(null);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(uploadedImage);
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        const response = await fetch(
          "http://localhost:4000/api/ai/analyze-certificate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("asure_token")}`,
            },
            body: JSON.stringify({
              image: base64Image,
              certificateType: "educational",
            }),
          }
        );

        const aiResult = await response.json();
        if (aiResult.success && aiResult.data.analysis) {
          const fullText = aiResult.data.analysis;
          setResult({
            isAuthentic: true,
            studentName: "AI Analysis",
            message: fullText,
            aiAnalysis: aiResult.data,
          });

          // Typewriter effect
          setDisplayedText("");
          setIsTyping(true);
          let currentIndex = 0;
          const typingInterval = setInterval(() => {
            if (currentIndex < fullText.length) {
              setDisplayedText(fullText.substring(0, currentIndex + 1));
              currentIndex++;
            } else {
              setIsTyping(false);
              clearInterval(typingInterval);
            }
          }, 20);
        } else {
          setResult({
            isAuthentic: false,
            message:
              aiResult.data?.analysis ||
              "Could not read certificate information",
          });
        }
        setLoading(false);
      };
    } catch (error) {
      console.error("Image verification error:", error);
      setResult({ isAuthentic: false });
      setLoading(false);
    }
  };

  return (
    <div className="verify-layout">
      <Sidebar />
      <div className="verify-main">
        <StatusBar title="Verify Educational Certificate" />
        <BackButton to="/home" label="Back to Dashboard" />

        <div className="verify-content">
          {!verificationMode && (
            <div className="mode-selection">
              <h2>Choose Verification Method</h2>
              <div className="mode-buttons">
                <button
                  className="mode-btn"
                  onClick={() => setVerificationMode("manual")}
                >
                  <span className="mode-icon">📝</span>
                  <h3>Enter Roll & ID</h3>
                  <p>Manually enter student credentials</p>
                </button>
                <button
                  className="mode-btn"
                  onClick={() => setVerificationMode("upload")}
                >
                  <span className="mode-icon">📸</span>
                  <h3>Upload Certificate</h3>
                  <p>AI will scan and verify the certificate</p>
                </button>
              </div>
            </div>
          )}

          {verificationMode === "manual" && (
            <div className="verification-form">
              <button
                className="back-to-mode"
                onClick={() => {
                  setVerificationMode(null);
                  setResult(null);
                }}
              >
                ← Change Method
              </button>
              <h2>Enter Certificate Details</h2>
              <form onSubmit={handleManualVerification}>
                <div className="form-group">
                  <label htmlFor="roll">Roll Number</label>
                  <input
                    type="text"
                    id="roll"
                    value={roll}
                    onChange={(e) => setRoll(e.target.value)}
                    placeholder="Enter roll number"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="id">ID Number</label>
                  <input
                    type="text"
                    id="id"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="Enter ID number"
                    required={false}
                  />
                </div>
                <button type="submit" className="verify-btn" disabled={loading}>
                  {loading ? "Verifying..." : "Verify Certificate"}
                </button>
              </form>
            </div>
          )}

          {verificationMode === "upload" && (
            <div className="verification-form">
              <button
                className="back-to-mode"
                onClick={() => {
                  setVerificationMode(null);
                  setResult(null);
                  setImagePreview(null);
                }}
              >
                ← Change Method
              </button>
              <h2>Upload Certificate Image</h2>
              <form onSubmit={handleImageVerification}>
                <div className="upload-area">
                  {!imagePreview ? (
                    <label
                      htmlFor="certificate-upload"
                      className="upload-label"
                    >
                      <span className="upload-icon">📄</span>
                      <p>Click to upload certificate</p>
                      <span className="upload-hint">
                        PNG, JPG, PDF (Max 5MB)
                      </span>
                      <input
                        type="file"
                        id="certificate-upload"
                        accept="image/*,.pdf"
                        onChange={handleImageUpload}
                        hidden
                      />
                    </label>
                  ) : (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Certificate preview" />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => {
                          setImagePreview(null);
                          setUploadedImage(null);
                        }}
                      >
                        ✕ Remove
                      </button>
                      <button
                        type="submit"
                        className="verify-btn"
                        disabled={loading}
                        style={{
                          marginTop: 8,
                          width: "100%",
                          padding: "15px",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        {loading
                          ? "🔄 AI is analyzing..."
                          : "✅ Verify with AI"}
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
                        <span className="detail-label">Roll Number:</span>
                        <span className="detail-value">{result.roll}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">ID Number:</span>
                        <span className="detail-value">{result.id}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Institute:</span>
                        <span className="detail-value">
                          {result.instituteName}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">EIIN Number:</span>
                        <span className="detail-value">
                          {result.eiinNumber}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Grade:</span>
                        <span className="detail-value grade">
                          {result.grade}
                        </span>
                      </div>

                      {result.gradeDetails && (
                        <div className="grade-details">
                          <h3>Grading System Details</h3>
                          <div className="grade-info">
                            <p>
                              <strong>GPA:</strong> {result.gradeDetails.gpa}
                            </p>
                            <p>
                              <strong>Grade:</strong>{" "}
                              {result.gradeDetails.grade}
                            </p>
                            <p>
                              <strong>Remarks:</strong>{" "}
                              {result.gradeDetails.remarks}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {!result.isAuthentic && (
                <div className="not-found-message">
                  <p>The certificate could not be verified in our database.</p>
                  <p>Please check the details and try again.</p>
                </div>
              )}

              <button
                className="verify-another-btn"
                onClick={() => {
                  setResult(null);
                  setRoll("");
                  setId("");
                  setImagePreview(null);
                  setUploadedImage(null);
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

export default VerifyEducation;

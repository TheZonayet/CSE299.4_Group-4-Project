import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StatusBar from "../components/StatusBar";
import BackButton from "../components/BackButton";
import "./VerifyMedicine.css";

interface MedicineInfo {
  isAuthentic: boolean;
  medicineName?: string;
  medicineCode?: string;
  companyName?: string;
  manufacturer?: string;
  genericName?: string;
  dosage?: string;
  power?: string;
  description?: string;
  sideEffects?: string[];
  price?: string;
  expiryDate?: string;
  batchNumber?: string;
  message?: string;
  aiAnalysis?: any;
}

interface PatientData {
  age: string;
  weight: string;
  conditions: string;
  allergies: string;
  currentMedications: string;
}

interface AISuggestion {
  suggestion: string;
  timestamp?: string;
}

const VerifyMedicine: React.FC = () => {
  const navigate = useNavigate();
  const [verificationMode, setVerificationMode] = useState<
    "search" | "upload" | null
  >(null);
  const [medicineName, setMedicineName] = useState("");
  const [medicineCode, setMedicineCode] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [patientData, setPatientData] = useState<PatientData>({
    age: "",
    weight: "",
    conditions: "",
    allergies: "",
    currentMedications: "",
  });
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [displayedAnalysis, setDisplayedAnalysis] = useState("");
  const [isTypingAnalysis, setIsTypingAnalysis] = useState(false);
  const [displayedSuggestion, setDisplayedSuggestion] = useState("");
  const [isTypingSuggestion, setIsTypingSuggestion] = useState(false);

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

  const handleSearchVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMedicineInfo(null);

    try {
      const response = await fetch(
        "http://localhost:4000/api/medicine/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("asure_token")}`,
          },
          body: JSON.stringify({ medicineName, medicineCode }),
        }
      );

      const result = await response.json();
      console.log(
        "Medicine verification response:",
        result,
        "status:",
        response.status
      );

      // Handle error responses
      if (response.status === 403) {
        setMedicineInfo({
          isAuthentic: false,
          message: result.error || "Insufficient credits",
        });
      } else if (response.status === 401) {
        setMedicineInfo({
          isAuthentic: false,
          message: "Authentication failed. Please log in again.",
        });
      } else if (result.success && result.data) {
        setMedicineInfo({
          isAuthentic: result.data.isAuthentic,
          medicineName: result.data.name || result.data.medicineName,
          medicineCode: result.data.code || result.data.medicineCode,
          companyName: result.data.manufacturer,
          manufacturer: result.data.manufacturer,
          dosage: result.data.power,
          power: result.data.power,
          genericName: result.data.genericName,
          price: result.data.price,
          expiryDate: result.data.expiryDate,
          description: result.data.description,
        });
      } else {
        setMedicineInfo({
          isAuthentic: false,
          message: result.message || "Medicine not found",
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      setMedicineInfo({
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
    setMedicineInfo(null);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(uploadedImage);
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        const response = await fetch(
          "http://localhost:4000/api/ai/analyze-medicine",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("asure_token")}`,
            },
            body: JSON.stringify({ image: base64Image }),
          }
        );

        const result = await response.json();
        if (result.success && result.data.analysis) {
          const analysisText = result.data.analysis;
          setMedicineInfo({
            isAuthentic: true,
            message: analysisText,
            aiAnalysis: result.data,
          });

          // Typewriter effect for analysis
          setDisplayedAnalysis("");
          setIsTypingAnalysis(true);
          let idx = 0;
          const interval = setInterval(() => {
            if (idx < analysisText.length) {
              setDisplayedAnalysis(analysisText.substring(0, idx + 1));
              idx++;
            } else {
              setIsTypingAnalysis(false);
              clearInterval(interval);
            }
          }, 20);
        } else {
          setMedicineInfo({
            isAuthentic: false,
            message:
              result.data?.analysis ||
              "Could not read medicine information from image",
          });
        }
        setLoading(false);
      };
    } catch (error) {
      console.error("Image verification error:", error);
      setMedicineInfo({ isAuthentic: false, message: "Verification failed" });
      setLoading(false);
    }
  };

  const handleGetSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineInfo || !medicineInfo.isAuthentic) {
      alert(
        "Verify a medicine first (search or upload) before asking AI suggestions."
      );
      return;
    }

    setLoadingSuggestion(true);
    setAiSuggestion(null);

    try {
      const response = await fetch(
        "http://localhost:4000/api/ai/medicine-suggestion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("asure_token")}`,
          },
          body: JSON.stringify({
            medicine: medicineInfo,
            patient: patientData,
          }),
        }
      );

      const result = await response.json();
      console.log("AI Response:", result);
      if (result.success && result.data) {
        // Extract suggestion text from the response
        const suggestionText =
          result.data.suggestion ||
          result.data.text ||
          JSON.stringify(result.data);

        // Ensure timestamp is set
        const suggestionWithTimestamp = {
          ...result.data,
          suggestion: suggestionText,
          timestamp: result.data.timestamp || new Date().toISOString(),
        };
        setAiSuggestion(suggestionWithTimestamp);

        // Typewriter effect for suggestion
        setDisplayedSuggestion("");
        setIsTypingSuggestion(true);
        let idx = 0;
        const interval = setInterval(() => {
          if (suggestionText && idx < suggestionText.length) {
            setDisplayedSuggestion(suggestionText.substring(0, idx + 1));
            idx++;
          } else {
            setIsTypingSuggestion(false);
            clearInterval(interval);
          }
        }, 15);
      } else {
        console.error("Failed to get AI suggestion:", result.message);
        alert(`AI Error: ${result.message || "Unknown error"}`);
      }
    } catch (error: any) {
      console.error("AI suggestion error:", error);
      alert(`Request failed: ${error.message || "Network error"}`);
    } finally {
      setLoadingSuggestion(false);
    }
  };

  return (
    <div className="verify-layout">
      <Sidebar />
      <div className="verify-main">
        <StatusBar title="Verify Medicine" />
        <BackButton to="/home" label="Back to Dashboard" />

        <div className="verify-content">
          {!verificationMode && (
            <div className="mode-selection">
              <h2>Choose Verification Method</h2>
              <div className="mode-buttons">
                <button
                  className="mode-btn"
                  onClick={() => setVerificationMode("search")}
                >
                  <span className="mode-icon">🔍</span>
                  <h3>Search Medicine</h3>
                  <p>Enter medicine name and company</p>
                </button>
                <button
                  className="mode-btn"
                  onClick={() => setVerificationMode("upload")}
                >
                  <span className="mode-icon">📸</span>
                  <h3>Upload Medicine Photo</h3>
                  <p>AI will recognize the medicine</p>
                </button>
              </div>
            </div>
          )}

          {verificationMode === "search" && (
            <div className="verification-form">
              <button
                className="back-to-mode"
                onClick={() => {
                  setVerificationMode(null);
                  setMedicineInfo(null);
                }}
              >
                ← Change Method
              </button>
              <h2>Enter Medicine Details</h2>
              <form onSubmit={handleSearchVerification}>
                <div className="form-group">
                  <label htmlFor="medicineName">Medicine Name</label>
                  <input
                    type="text"
                    id="medicineName"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                    placeholder="e.g., Napa"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="medicineCode">Medicine Code (Optional)</label>
                  <input
                    type="text"
                    id="medicineCode"
                    value={medicineCode}
                    onChange={(e) => setMedicineCode(e.target.value)}
                    placeholder="e.g., MED-001"
                  />
                </div>
                <button type="submit" className="verify-btn" disabled={loading}>
                  {loading ? "Verifying..." : "Search Medicine"}
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
                  setMedicineInfo(null);
                  setImagePreview(null);
                }}
              >
                ← Change Method
              </button>
              <h2>Upload Medicine Photo</h2>
              <form onSubmit={handleImageVerification}>
                <div className="upload-area">
                  {!imagePreview ? (
                    <label htmlFor="medicine-upload" className="upload-label">
                      <span className="upload-icon">💊</span>
                      <p>Click to upload medicine photo</p>
                      <span className="upload-hint">PNG, JPG (Max 5MB)</span>
                      <input
                        type="file"
                        id="medicine-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        hidden
                      />
                    </label>
                  ) : (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Medicine preview" />
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
                        style={{ width: "100%", marginTop: 4 }}
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

          {medicineInfo && (
            <div
              className={`result-card ${
                medicineInfo.isAuthentic ? "authentic" : "not-authentic"
              }`}
            >
              <div className="result-header">
                <span className="result-icon">
                  {medicineInfo.isAuthentic ? "✅" : "❌"}
                </span>
                <h2>
                  {medicineInfo.isAuthentic
                    ? "Medicine is Authentic"
                    : "Medicine Not Found"}
                </h2>
              </div>

              {medicineInfo.isAuthentic && (
                <>
                  <div className="result-details">
                    {medicineInfo.message && (
                      <div className="ai-analysis-text">
                        <pre
                          style={{
                            whiteSpace: "pre-wrap",
                            fontFamily: "inherit",
                            color: "#000",
                            lineHeight: "1.6",
                          }}
                        >
                          {displayedAnalysis}
                          {isTypingAnalysis && (
                            <span className="typing-cursor">|</span>
                          )}
                        </pre>
                      </div>
                    )}

                    {medicineInfo.medicineName && (
                      <>
                        <div className="detail-row">
                          <span className="detail-label">Medicine Name:</span>
                          <span className="detail-value">
                            {medicineInfo.medicineName}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Company:</span>
                          <span className="detail-value">
                            {medicineInfo.companyName}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Generic Name:</span>
                          <span className="detail-value">
                            {medicineInfo.genericName}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Dosage:</span>
                          <span className="detail-value">
                            {medicineInfo.dosage}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Price:</span>
                          <span className="detail-value">
                            {medicineInfo.price}
                          </span>
                        </div>
                        {medicineInfo.sideEffects && (
                          <div className="side-effects">
                            <h4>Side Effects:</h4>
                            <ul>
                              {medicineInfo.sideEffects.map((effect, index) => (
                                <li key={index}>{effect}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {!showSuggestionForm && (
                    <button
                      className="suggestion-btn"
                      onClick={() => setShowSuggestionForm(true)}
                    >
                      Get AI Suggestion for Patient
                    </button>
                  )}

                  {showSuggestionForm && !aiSuggestion && (
                    <div className="patient-form">
                      <h3>Patient Information</h3>
                      <form onSubmit={handleGetSuggestion}>
                        <div className="form-group">
                          <label>Age</label>
                          <input
                            type="number"
                            value={patientData.age}
                            onChange={(e) =>
                              setPatientData({
                                ...patientData,
                                age: e.target.value,
                              })
                            }
                            placeholder="Patient age"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Weight (kg)</label>
                          <input
                            type="number"
                            value={patientData.weight}
                            onChange={(e) =>
                              setPatientData({
                                ...patientData,
                                weight: e.target.value,
                              })
                            }
                            placeholder="Patient weight"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Medical Conditions</label>
                          <textarea
                            value={patientData.conditions}
                            onChange={(e) =>
                              setPatientData({
                                ...patientData,
                                conditions: e.target.value,
                              })
                            }
                            placeholder="e.g., Diabetes, Hypertension"
                            rows={3}
                          />
                        </div>
                        <div className="form-group">
                          <label>Known Allergies</label>
                          <textarea
                            value={patientData.allergies}
                            onChange={(e) =>
                              setPatientData({
                                ...patientData,
                                allergies: e.target.value,
                              })
                            }
                            placeholder="List any known allergies"
                            rows={2}
                          />
                        </div>
                        <div className="form-group">
                          <label>Current Medications</label>
                          <textarea
                            value={patientData.currentMedications}
                            onChange={(e) =>
                              setPatientData({
                                ...patientData,
                                currentMedications: e.target.value,
                              })
                            }
                            placeholder="List current medications"
                            rows={2}
                          />
                        </div>
                        <button
                          type="submit"
                          className="verify-btn"
                          disabled={loadingSuggestion}
                        >
                          {loadingSuggestion
                            ? "AI Analyzing..."
                            : "Get AI Suggestion"}
                        </button>
                      </form>
                    </div>
                  )}

                  {aiSuggestion && (
                    <div className="ai-suggestion">
                      <h3>🤖 AI Medical Suggestion</h3>
                      <div className="suggestion-text">
                        <pre
                          style={{
                            whiteSpace: "pre-wrap",
                            fontFamily: "inherit",
                            color: "#000",
                            lineHeight: "1.6",
                          }}
                        >
                          {displayedSuggestion}
                          {isTypingSuggestion && (
                            <span className="typing-cursor">|</span>
                          )}
                        </pre>
                      </div>
                      {aiSuggestion.timestamp && (
                        <div className="suggestion-timestamp">
                          <small>
                            Generated:{" "}
                            {new Date(aiSuggestion.timestamp).toLocaleString()}
                          </small>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              <button
                className="verify-another-btn"
                onClick={() => {
                  setMedicineInfo(null);
                  setMedicineName("");
                  setMedicineCode("");
                  setImagePreview(null);
                  setUploadedImage(null);
                  setShowSuggestionForm(false);
                  setAiSuggestion(null);
                }}
              >
                Verify Another Medicine
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyMedicine;

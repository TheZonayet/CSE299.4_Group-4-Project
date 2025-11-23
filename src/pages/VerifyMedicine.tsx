import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StatusBar from "../components/StatusBar";
import BackButton from "../components/BackButton";
import "./VerifyMedicine.css";

interface MedicineInfo {
  isAuthentic: boolean;
  medicineName?: string;
  companyName?: string;
  genericName?: string;
  dosage?: string;
  sideEffects?: string[];
  price?: string;
  expiryDate?: string;
}

interface PatientData {
  age: string;
  weight: string;
  conditions: string;
  allergies: string;
  currentMedications: string;
}

interface AISuggestion {
  isRecommended: boolean;
  reasons?: string[];
  warnings?: string[];
  alternatives?: Array<{
    name: string;
    price: string;
    reason: string;
  }>;
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
        "http://localhost:3001/api/medicine/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ medicineName, medicineCode }),
        }
      );

      const result = await response.json();
      if (result.success && result.data) {
        setMedicineInfo({
          isAuthentic: result.data.isAuthentic,
          medicineName: result.data.name,
          companyName: result.data.manufacturer,
          dosage: result.data.power,
          price: result.data.price,
          expiryDate: result.data.expiryDate,
        });
      } else {
        setMedicineInfo({ isAuthentic: false });
      }
    } catch (error) {
      console.error("Verification error:", error);
      setMedicineInfo({ isAuthentic: false });
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
      const formData = new FormData();
      formData.append("medicineImage", uploadedImage);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/verify-medicine-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("asure_token")}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      setMedicineInfo(data);
    } catch (error) {
      console.error("Image verification error:", error);
      setMedicineInfo({ isAuthentic: false });
    } finally {
      setLoading(false);
    }
  };

  const handleGetSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSuggestion(true);
    setAiSuggestion(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/medicine-suggestion`,
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

      const data = await response.json();
      setAiSuggestion(data);
    } catch (error) {
      console.error("AI suggestion error:", error);
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
                    </div>
                  )}
                </div>
                {uploadedImage && (
                  <button
                    type="submit"
                    className="verify-btn"
                    disabled={loading}
                  >
                    {loading ? "AI is analyzing..." : "Verify with AI"}
                  </button>
                )}
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
                      <span className="detail-value">{medicineInfo.price}</span>
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
                    <div
                      className={`ai-suggestion ${
                        aiSuggestion.isRecommended
                          ? "recommended"
                          : "not-recommended"
                      }`}
                    >
                      <h3>
                        {aiSuggestion.isRecommended
                          ? "✅ Recommended for Patient"
                          : "⚠️ Not Recommended"}
                      </h3>
                      {aiSuggestion.reasons && (
                        <div className="suggestion-section">
                          <h4>Reasons:</h4>
                          <ul>
                            {aiSuggestion.reasons.map((reason, index) => (
                              <li key={index}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {aiSuggestion.warnings &&
                        aiSuggestion.warnings.length > 0 && (
                          <div className="suggestion-section warnings">
                            <h4>⚠️ Warnings:</h4>
                            <ul>
                              {aiSuggestion.warnings.map((warning, index) => (
                                <li key={index}>{warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      {aiSuggestion.alternatives && (
                        <div className="alternatives">
                          <h4>Alternative Medicines:</h4>
                          {aiSuggestion.alternatives.map((alt, index) => (
                            <div key={index} className="alternative-card">
                              <h5>{alt.name}</h5>
                              <p className="alt-price">Price: {alt.price}</p>
                              <p className="alt-reason">{alt.reason}</p>
                            </div>
                          ))}
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

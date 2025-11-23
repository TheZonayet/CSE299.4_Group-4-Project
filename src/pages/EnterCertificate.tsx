import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../services/api";
import Sidebar from "../components/Sidebar";
import StatusBar from "../components/StatusBar";
import BackButton from "../components/BackButton";
import "./Dashboard.css";
import "./FormPages.css";

const EnterCertificate: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    rollNumber: "",
    idNumber: "",
    studentName: "",
    degree: "",
    cgpaOrGpa: "",
    passingYear: "",
    department: "",
    instituteName: "",
    eiinNumber: ""
  });

  useEffect(() => {
    getProfile()
      .then((data) => {
        setUser(data.user);
        // Auto-fill institute information
        setFormData((prev) => ({
          ...prev,
          instituteName: data.user?.profile?.instituteName || "",
          eiinNumber: data.user?.profile?.eiinNumber || ""
        }));
        setLoading(false);
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/education/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          rollNumber: formData.rollNumber,
          instituteId: user?.profile?.instituteId || "UNKNOWN",
          studentName: formData.studentName,
          degree: formData.degree,
          cgpa: formData.cgpaOrGpa,
          passingYear: formData.passingYear,
          department: formData.department,
          instituteName: formData.instituteName,
          eiinNumber: formData.eiinNumber,
          idNumber: formData.idNumber
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Certificate added successfully!" });
        // Reset form except auto-filled fields
        setFormData({
          rollNumber: "",
          idNumber: "",
          studentName: "",
          degree: "",
          cgpaOrGpa: "",
          passingYear: "",
          department: "",
          instituteName: formData.instituteName,
          eiinNumber: formData.eiinNumber
        });
        setImageFile(null);
        setImagePreview(null);
        
        // Redirect back to dashboard after 2 seconds
        setTimeout(() => {
          navigate("/education-dashboard");
        }, 2000);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to add certificate" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error occurred" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="home-layout">
      <Sidebar />
      <div className="home-main">
        <StatusBar title="Enter New Certificate" />
        <BackButton to="/education-dashboard" label="Back to Dashboard" />

        <div className="home-content">
          <h2 className="form-title">🎓 Add New Educational Certificate</h2>

          {message && (
            <div className={`alert alert-${message.type === "success" ? "success" : "danger"} alert-container`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-container">
            <div className="mb-3">
              <label htmlFor="rollNumber" className="form-label">Roll Number *</label>
              <input
                type="text"
                className="form-control"
                id="rollNumber"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="idNumber" className="form-label">ID Number *</label>
              <input
                type="text"
                className="form-control"
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="studentName" className="form-label">Student Name *</label>
              <input
                type="text"
                className="form-control"
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="degree" className="form-label">Degree *</label>
              <input
                type="text"
                className="form-control"
                id="degree"
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                placeholder="e.g., Bachelor of Science, Master of Arts"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="cgpaOrGpa" className="form-label">CGPA or GPA *</label>
              <input
                type="text"
                className="form-control"
                id="cgpaOrGpa"
                name="cgpaOrGpa"
                value={formData.cgpaOrGpa}
                onChange={handleInputChange}
                placeholder="e.g., 3.75"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="passingYear" className="form-label">Passing Year *</label>
              <input
                type="text"
                className="form-control"
                id="passingYear"
                name="passingYear"
                value={formData.passingYear}
                onChange={handleInputChange}
                placeholder="e.g., 2024"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="department" className="form-label">Department or Group</label>
              <input
                type="text"
                className="form-control"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="e.g., Computer Science"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="instituteName" className="form-label">Institute Name (Auto-filled)</label>
              <input
                type="text"
                className="form-control"
                id="instituteName"
                name="instituteName"
                value={formData.instituteName}
                readOnly
                disabled
              />
            </div>

            <div className="mb-3">
              <label htmlFor="eiinNumber" className="form-label">EIIN Number (Auto-filled)</label>
              <input
                type="text"
                className="form-control"
                id="eiinNumber"
                name="eiinNumber"
                value={formData.eiinNumber}
                readOnly
                disabled
              />
            </div>

            <div className="mb-3">
              <label htmlFor="imageUpload" className="form-label">Upload Certificate Image (PNG)</label>
              <input
                type="file"
                className="form-control"
                id="imageUpload"
                accept=".png,image/png"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
              {submitting ? "Saving..." : "Save Certificate"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnterCertificate;

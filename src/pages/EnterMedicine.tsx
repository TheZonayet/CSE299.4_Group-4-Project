import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../services/api";
import Sidebar from "../components/Sidebar";
import StatusBar from "../components/StatusBar";
import BackButton from "../components/BackButton";
import "./Dashboard.css";
import "./FormPages.css";

const EnterMedicine: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    medicineName: "",
    power: "",
    medicineCode: "",
    manufacturer: "",
    batchNumber: "",
    expiryDate: "",
    price: "",
    description: ""
  });

  useEffect(() => {
    getProfile()
      .then((data) => {
        setUser(data.user);
        // Auto-fill manufacturer information
        setFormData((prev) => ({
          ...prev,
          manufacturer: data.user?.profile?.companyName || ""
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
      const response = await fetch("http://localhost:3001/api/medicine/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          medicineCode: formData.medicineCode,
          medicineName: formData.medicineName,
          power: formData.power,
          manufacturer: formData.manufacturer,
          batchNumber: formData.batchNumber,
          expiryDate: formData.expiryDate,
          price: formData.price,
          description: formData.description
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Medicine added successfully!" });
        // Reset form except auto-filled fields
        setFormData({
          medicineName: "",
          power: "",
          medicineCode: "",
          manufacturer: formData.manufacturer,
          batchNumber: "",
          expiryDate: "",
          price: "",
          description: ""
        });
        setImageFile(null);
        setImagePreview(null);
        
        // Redirect back to dashboard after 2 seconds
        setTimeout(() => {
          navigate("/medicine-dashboard");
        }, 2000);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to add medicine" });
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
        <StatusBar title="Enter New Medicine" />
        <BackButton to="/medicine-dashboard" label="Back to Dashboard" />

        <div className="home-content">
          <h2 className="form-title">💊 Add New Medicine</h2>

          {message && (
            <div className={`alert alert-${message.type === "success" ? "success" : "danger"} alert-container`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-container">
            <div className="mb-3">
              <label htmlFor="medicineName" className="form-label">Medicine Name *</label>
              <input
                type="text"
                className="form-control"
                id="medicineName"
                name="medicineName"
                value={formData.medicineName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="power" className="form-label">Power *</label>
              <input
                type="text"
                className="form-control"
                id="power"
                name="power"
                value={formData.power}
                onChange={handleInputChange}
                placeholder="e.g., 500mg, 10ml"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="medicineCode" className="form-label">Medicine Code *</label>
              <input
                type="text"
                className="form-control"
                id="medicineCode"
                name="medicineCode"
                value={formData.medicineCode}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="manufacturer" className="form-label">Manufacturer Name (Auto-filled)</label>
              <input
                type="text"
                className="form-control"
                id="manufacturer"
                name="manufacturer"
                value={formData.manufacturer}
                readOnly
                disabled
              />
            </div>

            <div className="mb-3">
              <label htmlFor="batchNumber" className="form-label">Batch Number *</label>
              <input
                type="text"
                className="form-control"
                id="batchNumber"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="expiryDate" className="form-label">Expiry Date *</label>
              <input
                type="date"
                className="form-control"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price *</label>
              <input
                type="text"
                className="form-control"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 25.50"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter medicine description..."
              />
            </div>

            <div className="mb-3">
              <label htmlFor="imageUpload" className="form-label">Upload Medicine Image (PNG)</label>
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
              {submitting ? "Saving..." : "Save Medicine"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnterMedicine;

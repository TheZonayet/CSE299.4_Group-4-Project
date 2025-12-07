import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../services/api";
import Sidebar from "../components/Sidebar";
import StatusBar from "../components/StatusBar";
import BackButton from "../components/BackButton";
import "./Dashboard.css";
import "./FormPages.css";

const EnterTutorialCertificate: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(
    null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    certificateId: "",
    instituteId: "",
    instituteName: "",
    student: "",
    course: "",
    completionDate: "",
    duration: "",
    grade: "",
    skillsAchieved: "",
  });

  useEffect(() => {
    getProfile()
      .then((data) => {
        setUser(data.user);
        // Auto-fill institute information
        setFormData((prev) => ({
          ...prev,
          instituteName: data.user?.profile?.instituteName || "",
          instituteId: data.user?.profile?.instituteId || "",
        }));
        setLoading(false);
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      const token = localStorage.getItem("asure_token");
      const response = await fetch(
        "http://localhost:4000/api/tutorial/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            certificateId: formData.certificateId,
            instituteId: formData.instituteId,
            instituteName: formData.instituteName,
            student: formData.student,
            course: formData.course,
            completionDate: formData.completionDate,
            duration: formData.duration,
            grade: formData.grade,
            skillsAchieved: formData.skillsAchieved,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Tutorial certificate added successfully!",
        });
        // Reset form except auto-filled fields
        setFormData({
          certificateId: "",
          instituteId: formData.instituteId,
          instituteName: formData.instituteName,
          student: "",
          course: "",
          completionDate: "",
          duration: "",
          grade: "",
          skillsAchieved: "",
        });
        setImageFile(null);
        setImagePreview(null);

        // Redirect back to dashboard after 2 seconds
        setTimeout(() => {
          navigate("/tutorial-dashboard");
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to add tutorial certificate",
        });
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
        <StatusBar title="Enter New Tutorial Certificate" />
        <BackButton to="/tutorial-dashboard" label="Back to Dashboard" />

        <div className="home-content">
          <h2 className="form-title">📜 Add New Tutorial Certificate</h2>

          {message && (
            <div
              className={`alert alert-${
                message.type === "success" ? "success" : "danger"
              } alert-container`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-container">
            <div className="mb-3">
              <label htmlFor="certificateId" className="form-label">
                Certificate ID *
              </label>
              <input
                type="text"
                className="form-control"
                id="certificateId"
                name="certificateId"
                value={formData.certificateId}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="instituteId" className="form-label">
                Institute ID (Auto-filled)
              </label>
              <input
                type="text"
                className="form-control"
                id="instituteId"
                name="instituteId"
                value={formData.instituteId}
                readOnly
                disabled
              />
            </div>

            <div className="mb-3">
              <label htmlFor="instituteName" className="form-label">
                Institute Name (Auto-filled)
              </label>
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
              <label htmlFor="student" className="form-label">
                Student Name *
              </label>
              <input
                type="text"
                className="form-control"
                id="student"
                name="student"
                value={formData.student}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="course" className="form-label">
                Course *
              </label>
              <input
                type="text"
                className="form-control"
                id="course"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                placeholder="e.g., Web Development, Data Science"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="completionDate" className="form-label">
                Completion Date *
              </label>
              <input
                type="date"
                className="form-control"
                id="completionDate"
                name="completionDate"
                value={formData.completionDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="duration" className="form-label">
                Duration *
              </label>
              <input
                type="text"
                className="form-control"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g., 3 months, 6 weeks"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="grade" className="form-label">
                Grade *
              </label>
              <input
                type="text"
                className="form-control"
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                placeholder="e.g., A+, 95%"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="skillsAchieved" className="form-label">
                Skills Achieved *
              </label>
              <textarea
                className="form-control"
                id="skillsAchieved"
                name="skillsAchieved"
                value={formData.skillsAchieved}
                onChange={handleInputChange}
                rows={3}
                placeholder="e.g., HTML, CSS, JavaScript, React"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="imageUpload" className="form-label">
                Upload Certificate Image (PNG)
              </label>
              <input
                type="file"
                className="form-control"
                id="imageUpload"
                accept=".png,image/png"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Certificate"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnterTutorialCertificate;

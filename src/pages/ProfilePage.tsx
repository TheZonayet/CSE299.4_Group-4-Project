import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import StatusBar from "../components/StatusBar";
import { getProfile, updateProfile } from "../services/api";
import "./ProfilePage.css";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setUser(data.user);
        setFormData(data.user.profile || {});
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const result = await updateProfile(formData);
      setUser(result.user);
      setMessage("✅ Profile updated successfully!");
    } catch (err: any) {
      setMessage(`❌ ${err.message || "Update failed"}`);
    } finally {
      setSaving(false);
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
    <div className="profile-layout">
      <Sidebar />
      <div className="profile-main">
        <StatusBar title="My Profile" />

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {user?.auth?.email?.charAt(0).toUpperCase() || "?"}
              </div>
              <div>
                <h2>{user?.auth?.email || user?.profile?.officialEmail}</h2>
                <p className="profile-role">{user?.role}</p>
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-card">
                <h4>Verification Credits</h4>
                <p className="stat-value">{user?.verificationCredits || 0}</p>
              </div>
              <div className="stat-card">
                <h4>Member Since</h4>
                <p className="stat-value">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            {message && (
              <div
                className={`alert ${
                  message.startsWith("✅") ? "alert-success" : "alert-danger"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="profile-form">
              <h3>Profile Information</h3>

              {Object.keys(formData).map((field) => (
                <div className="mb-3" key={field}>
                  <label className="form-label">
                    {field
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Enter ${field
                      .replace(/([A-Z])/g, " $1")
                      .toLowerCase()}`}
                    value={formData[field] || ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                </div>
              ))}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

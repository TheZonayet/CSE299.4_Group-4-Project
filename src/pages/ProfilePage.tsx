import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import StatusBar from "../components/StatusBar";
import BackButton from "../components/BackButton";
import { getProfile, updateProfile } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "./ProfilePage.css";

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const monthlyFreeCredits = 100;
  const creditsRemaining = monthlyFreeCredits - (user?.monthlyCreditsUsed || 0);

  useEffect(() => {
    getProfile()
      .then((data) => {
        updateUser(data.user);
        setFormData(data.user.profile || {});
        setProfilePicture(data.user.profile?.profilePicture || null);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [updateUser]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage("❌ Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        console.log("Profile picture loaded, size:", base64String.length);
        setProfilePicture(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const updatedData = { ...formData, profilePicture };
      console.log(
        "Saving profile with picture:",
        profilePicture ? "YES" : "NO"
      );
      const result = await updateProfile(updatedData);
      console.log("Profile updated, returned user:", result.user);
      updateUser(result.user);
      setFormData(result.user.profile || {});
      setProfilePicture(result.user.profile?.profilePicture || null);
      console.log(
        "Profile picture after save:",
        result.user.profile?.profilePicture ? "SET" : "NOT SET"
      );
      setIsEditing(false);
      setMessage("✅ Profile updated successfully!");
      setTimeout(() => setMessage(null), 3000);
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

  const renderProfileFields = () => {
    const role = user?.role?.toUpperCase();

    if (role === "EDUCATION") {
      return (
        <>
          <div className="form-group">
            <label>Institute Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.instituteName || ""}
              onChange={(e) => handleChange("instituteName", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>EIIN Number</label>
            <input
              type="text"
              className="form-control"
              value={formData.eiinNumber || ""}
              onChange={(e) => handleChange("eiinNumber", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Official Email</label>
            <input
              type="email"
              className="form-control"
              value={formData.officialEmail || ""}
              onChange={(e) => handleChange("officialEmail", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Official Phone</label>
            <input
              type="tel"
              className="form-control"
              value={formData.officialPhone || ""}
              onChange={(e) => handleChange("officialPhone", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea
              className="form-control"
              value={formData.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              disabled={!isEditing}
              rows={3}
            />
          </div>
        </>
      );
    } else if (role === "MEDICINE") {
      return (
        <>
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.companyName || ""}
              onChange={(e) => handleChange("companyName", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Government License Number</label>
            <input
              type="text"
              className="form-control"
              value={formData.govtLicenseNumber || ""}
              onChange={(e) =>
                handleChange("govtLicenseNumber", e.target.value)
              }
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Official Email</label>
            <input
              type="email"
              className="form-control"
              value={formData.officialEmail || ""}
              onChange={(e) => handleChange("officialEmail", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Official Phone</label>
            <input
              type="tel"
              className="form-control"
              value={formData.officialPhone || ""}
              onChange={(e) => handleChange("officialPhone", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea
              className="form-control"
              value={formData.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              disabled={!isEditing}
              rows={3}
            />
          </div>
        </>
      );
    } else if (role === "TUTORIALS") {
      return (
        <>
          <div className="form-group">
            <label>Institute Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.instituteName || ""}
              onChange={(e) => handleChange("instituteName", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Government License Number</label>
            <input
              type="text"
              className="form-control"
              value={formData.govtLicenseNumber || ""}
              onChange={(e) =>
                handleChange("govtLicenseNumber", e.target.value)
              }
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Official Email</label>
            <input
              type="email"
              className="form-control"
              value={formData.officialEmail || ""}
              onChange={(e) => handleChange("officialEmail", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Official Phone</label>
            <input
              type="tel"
              className="form-control"
              value={formData.officialPhone || ""}
              onChange={(e) => handleChange("officialPhone", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea
              className="form-control"
              value={formData.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              disabled={!isEditing}
              rows={3}
            />
          </div>
        </>
      );
    } else if (role === "PERSONAL") {
      return (
        <>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="profile-layout">
      <Sidebar />
      <div className="profile-main">
        <StatusBar title="My Profile" />

        <div className="profile-content">
          {/* Profile Header with Picture */}
          <div className="profile-header-card">
            <div className="profile-picture-section">
              <div className="profile-avatar-large">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" />
                ) : (
                  <span className="avatar-placeholder">
                    {user?.auth?.email?.charAt(0).toUpperCase() || "?"}
                  </span>
                )}
              </div>
              {isEditing && (
                <div className="upload-btn-wrapper">
                  <button className="btn-upload">Change Photo</button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              )}
            </div>
            <div className="profile-info-section">
              <h2>
                {formData.instituteName ||
                  formData.companyName ||
                  user?.auth?.email}
              </h2>
              <p className="profile-role-badge">{user?.role}</p>
              <p className="profile-email">{user?.auth?.email}</p>
            </div>
          </div>

          {/* Credits Section */}
          <div className="credits-section">
            <div className="credit-card free-credits">
              <div className="credit-icon">🎁</div>
              <div className="credit-info">
                <h4>Monthly Free Credits</h4>
                <p className="credit-value">
                  {creditsRemaining} / {monthlyFreeCredits}
                </p>
                <small>Resets monthly</small>
              </div>
            </div>

            <div className="credit-card total-credits">
              <div className="credit-icon">💳</div>
              <div className="credit-info">
                <h4>Verification Credits</h4>
                <p className="credit-value">
                  {creditsRemaining} / {monthlyFreeCredits}
                </p>
                <small>Available for use</small>
              </div>
            </div>

            <div className="credit-card purchased-credits">
              <div className="credit-icon">🛒</div>
              <div className="credit-info">
                <h4>Purchased Credits</h4>
                <p className="credit-value">
                  {user?.totalCreditsPurchased || 0}
                </p>
                <small>Lifetime total</small>
              </div>
            </div>
          </div>

          {creditsRemaining <= 10 && (
            <div className="alert alert-warning">
              ⚠️ Your free monthly credits are running low!
              <button
                className="btn btn-sm btn-primary ms-3"
                onClick={() => setShowPaymentModal(true)}
              >
                Buy More Credits
              </button>
            </div>
          )}

          {message && (
            <div
              className={`alert ${
                message.startsWith("✅") ? "alert-success" : "alert-danger"
              }`}
            >
              {message}
            </div>
          )}

          {/* Profile Form */}
          <div className="profile-form-card">
            <div className="form-header">
              <h3>Profile Information</h3>
              <div className="form-actions">
                {!isEditing ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(user?.profile || {});
                        setProfilePicture(
                          user?.profile?.profilePicture || null
                        );
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleSubmit}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "💾 Save Changes"}
                    </button>
                  </>
                )}
              </div>
            </div>

            <form className="profile-form">{renderProfileFields()}</form>
          </div>

          {/* Member Info */}
          <div className="member-info">
            <p>
              <strong>Member Since:</strong>{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowPaymentModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Purchase Credits</h3>
              <button onClick={() => setShowPaymentModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="credit-packages">
                <div className="package-card">
                  <h4>Starter Pack</h4>
                  <p className="package-credits">50 Credits</p>
                  <p className="package-price">৳500 / $5</p>
                  <button className="btn btn-primary">Select</button>
                </div>
                <div className="package-card recommended">
                  <span className="badge-recommended">Best Value</span>
                  <h4>Basic Pack</h4>
                  <p className="package-credits">100 Credits</p>
                  <p className="package-price">৳900 / $9</p>
                  <small>Save 10%</small>
                  <button className="btn btn-primary">Select</button>
                </div>
                <div className="package-card">
                  <h4>Standard Pack</h4>
                  <p className="package-credits">250 Credits</p>
                  <p className="package-price">৳2000 / $20</p>
                  <small>Save 20%</small>
                  <button className="btn btn-primary">Select</button>
                </div>
                <div className="package-card">
                  <h4>Premium Pack</h4>
                  <p className="package-credits">500 Credits</p>
                  <p className="package-price">৳3500 / $35</p>
                  <small>Save 30%</small>
                  <button className="btn btn-primary">Select</button>
                </div>
              </div>

              <div className="payment-methods">
                <h4>Payment Methods</h4>
                <div className="payment-options">
                  <button className="payment-btn">
                    <span>📱</span> bKash
                  </button>
                  <button className="payment-btn">
                    <span>💳</span> Visa
                  </button>
                  <button className="payment-btn">
                    <span>💳</span> Mastercard
                  </button>
                  <button className="payment-btn">
                    <span>🏦</span> Bank Transfer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

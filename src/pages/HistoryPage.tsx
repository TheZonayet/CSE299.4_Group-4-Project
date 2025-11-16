import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import StatusBar from "../components/StatusBar";
import { getVerificationHistory } from "../services/api";
import "./HistoryPage.css";

interface Verification {
  id: string;
  type: string;
  status: string;
  verifiedAt: string;
  qrCode?: string;
}

const HistoryPage: React.FC = () => {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVerificationHistory()
      .then((data) => {
        setVerifications(data.verifications);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      educational: "🎓",
      medicine: "💊",
      product: "📦",
      tutorial: "📜",
    };
    return icons[type] || "✓";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
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
    <div className="history-layout">
      <Sidebar />
      <div className="history-main">
        <StatusBar title="Verification History" />

        <div className="history-content">
          <div className="history-header">
            <h2>Your Verifications</h2>
            <p className="history-count">
              Total: {verifications.length} verification
              {verifications.length !== 1 ? "s" : ""}
            </p>
          </div>

          {verifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No Verifications Yet</h3>
              <p>
                Start verifying certificates, medicines, or products to see your
                history here.
              </p>
            </div>
          ) : (
            <div className="verification-list">
              {verifications.map((verification) => (
                <div key={verification.id} className="verification-item">
                  <div className="verification-icon">
                    {getTypeIcon(verification.type)}
                  </div>
                  <div className="verification-details">
                    <h4 className="verification-type">
                      {verification.type.charAt(0).toUpperCase() +
                        verification.type.slice(1)}{" "}
                      Verification
                    </h4>
                    <p className="verification-date">
                      {formatDate(verification.verifiedAt)}
                    </p>
                    {verification.qrCode && (
                      <p className="verification-qr">
                        QR Code: {verification.qrCode}
                      </p>
                    )}
                  </div>
                  <div className={`verification-status ${verification.status}`}>
                    {verification.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import StatusBar from "../components/StatusBar";
import BigActionButton from "../components/BigActionButton";
import { createVerification } from "../services/api";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleVerification = async (type: string, title: string) => {
    setLoading(type);
    setMessage(null);

    try {
      const result = await createVerification(type, {
        timestamp: new Date().toISOString(),
      });
      setMessage(
        `✅ ${title} verified successfully! ID: ${result.verification.id}`
      );
    } catch (err: any) {
      setMessage(`❌ ${err.message || "Verification failed"}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="home-layout">
      <Sidebar />
      <div className="home-main">
        <StatusBar title="Verification Dashboard" />

        <div className="home-content">
          <h2 className="home-title">Select Verification Type</h2>

          {message && (
            <div
              className={`alert ${
                message.startsWith("✅") ? "alert-success" : "alert-danger"
              }`}
            >
              {message}
            </div>
          )}

          <div className="verification-grid">
            <BigActionButton
              title="Verify Educational Institute"
              subtitle="Validate certificates from educational institutions"
              icon="🎓"
              onClick={() =>
                handleVerification("educational", "Educational Institute")
              }
              disabled={loading !== null}
            />

            <BigActionButton
              title="Verify Medicines"
              subtitle="Check authenticity of pharmaceutical products"
              icon="💊"
              onClick={() => handleVerification("medicine", "Medicine")}
              disabled={loading !== null}
            />

            <BigActionButton
              title="Verify Random Products"
              subtitle="Authenticate any product via QR code"
              icon="📦"
              onClick={() => handleVerification("product", "Product")}
              disabled={loading !== null}
            />

            <BigActionButton
              title="Verify Tutorial Certificate"
              subtitle="Validate tutorial institute certificates"
              icon="📜"
              onClick={() =>
                handleVerification("tutorial", "Tutorial Certificate")
              }
              disabled={loading !== null}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

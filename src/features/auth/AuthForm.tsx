import React, { useState } from "react";
import { loginUser, registerUser } from "../../services/api";

interface AuthFormProps {
  role: string;
  onSuccess: () => void;
  onBack: () => void;
}

// Role-specific field configurations
const ROLE_FIELDS: Record<
  string,
  { label: string; name: string; type: string; required: boolean }[]
> = {
  EDUCATION: [
    {
      label: "Institute Name",
      name: "instituteName",
      type: "text",
      required: true,
    },
    {
      label: "Official Phone",
      name: "officialPhone",
      type: "tel",
      required: true,
    },
    { label: "EIIN Number", name: "eiinNumber", type: "text", required: true },
    {
      label: "Official Email",
      name: "officialEmail",
      type: "email",
      required: true,
    },
  ],
  PERSONAL: [{ label: "Email", name: "email", type: "email", required: true }],
  TUTORIALS: [
    {
      label: "Institute Name",
      name: "instituteName",
      type: "text",
      required: true,
    },
    {
      label: "Official Phone",
      name: "officialPhone",
      type: "tel",
      required: true,
    },
    {
      label: "Govt. License Number",
      name: "govtLicenseNumber",
      type: "text",
      required: true,
    },
    {
      label: "Official Email",
      name: "officialEmail",
      type: "email",
      required: true,
    },
  ],
  MEDICINE: [
    {
      label: "Company Name",
      name: "companyName",
      type: "text",
      required: true,
    },
    {
      label: "Official Phone",
      name: "officialPhone",
      type: "tel",
      required: true,
    },
    {
      label: "Govt. License Number",
      name: "govtLicenseNumber",
      type: "text",
      required: true,
    },
    {
      label: "Official Email",
      name: "officialEmail",
      type: "email",
      required: true,
    },
  ],
};

const AuthForm: React.FC<AuthFormProps> = ({ role, onSuccess, onBack }) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roleFields = ROLE_FIELDS[role.toUpperCase()] || [];

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate password match on registration
    if (mode === "register") {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
    }

    try {
      if (mode === "login") {
        await loginUser(role.toUpperCase(), formData);
      } else {
        await registerUser(role.toUpperCase(), formData);
        // After registration, switch to login mode
        setMode("login");
        setFormData({});
        setError(null);
        alert("Registration successful! Please log in.");
        setLoading(false);
        return;
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-4">
      <div className="card mx-auto auth-card">
        <div className="card-body">
          <button className="btn btn-link text-primary p-0" onClick={onBack}>
            ← Back
          </button>
          <h5 className="card-title mt-2">
            {role} — {mode === "login" ? "Login" : "Register"}
          </h5>

          <div className="mb-3 mt-3">
            <div className="btn-group w-100" role="group">
              <button
                type="button"
                className={`btn ${
                  mode === "login" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => {
                  setMode("login");
                  setFormData({});
                  setError(null);
                }}
              >
                Login
              </button>
              <button
                type="button"
                className={`btn ${
                  mode === "register" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => {
                  setMode("register");
                  setFormData({});
                  setError(null);
                }}
              >
                Register
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Role-specific fields */}
            {roleFields.map((field) => (
              <div className="mb-3" key={field.name}>
                <label className="form-label">{field.label}</label>
                <input
                  type={field.type}
                  className="form-control"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                />
              </div>
            ))}

            {/* Password fields */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={formData.password || ""}
                onChange={(e) => handleChange("password", e.target.value)}
                required
              />
            </div>

            {mode === "register" && (
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword || ""}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  required
                />
              </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            <button
              className="btn btn-success w-100"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Login"
                : "Register"}
            </button>
          </form>

          {mode === "login" && (
            <p className="text-center mt-3">
              Don't have an account?{" "}
              <button
                className="btn btn-link p-0"
                onClick={() => {
                  setMode("register");
                  setFormData({});
                  setError(null);
                }}
              >
                Click here to register
              </button>
            </p>
          )}

          {mode === "register" && (
            <p className="text-center mt-3">
              Already have an account?{" "}
              <button
                className="btn btn-link p-0"
                onClick={() => {
                  setMode("login");
                  setFormData({});
                  setError(null);
                }}
              >
                Click here to login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

import React, { useState } from "react";
import { loginUser, registerUser } from "../../services/api";

interface AuthFormProps {
  role: string;
  onSuccess: (user: any) => void;
  onBack: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ role, onSuccess, onBack }) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result =
        mode === "login"
          ? await loginUser(role, username, password)
          : await registerUser(role, username, password);
      onSuccess(result.user);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-4">
      <div className="card mx-auto auth-card" style={{ maxWidth: 420 }}>
        <div className="card-body">
          <button className="btn btn-link text-light" onClick={onBack}>
            ← Back
          </button>
          <h5 className="card-title">
            {role} — {mode === "login" ? "Login" : "Register"}
          </h5>

          <div className="mb-3">
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn ${
                  mode === "login" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                type="button"
                className={`btn ${
                  mode === "register" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

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
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

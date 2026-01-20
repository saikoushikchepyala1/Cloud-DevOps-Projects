import { useState } from "react";
import {
  resetLockedPassword,
  setLockedPassword
} from "../services/notesApi";
import "../styles/verifyaccountmodal.css";

export default function VerifyAccountPasswordModal({ onVerified, onClose }) {
  const [newLockedPassword, setNewLockedPassword] = useState("");
  const [confirmLockedPassword, setConfirmLockedPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSetNewLockedPassword() {
    if (!newLockedPassword || !confirmLockedPassword) {
      setError("Both fields are required");
      return;
    }

    if (newLockedPassword !== confirmLockedPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await resetLockedPassword();
      await setLockedPassword(newLockedPassword.trim());
      onVerified();
    } catch {
      setError("Failed to reset locked password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="verify-modal">
        <div className="verify-header">
          <h3>Set New Locked Password</h3>
          <button className="icon-btn" onClick={onClose}>×</button>
        </div>

        <div className="verify-body">
          <input
            type="password"
            placeholder="New locked password"
            value={newLockedPassword}
            autoComplete="new-password"
            onChange={(e) => {
              setNewLockedPassword(e.target.value);
              setError("");
            }}
          />

          <input
            type="password"
            placeholder="Confirm new locked password"
            value={confirmLockedPassword}
            autoComplete="new-password"
            onChange={(e) => {
              setConfirmLockedPassword(e.target.value);
              setError("");
            }}
          />

          {error && <div className="error-text">{error}</div>}
        </div>

        <div className="verify-footer">
          <button
            className="save-btn"
            disabled={loading}
            onClick={handleSetNewLockedPassword}
          >
            {loading ? "Processing..." : "Set Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

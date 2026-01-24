import { useState, useEffect } from "react";
import {
  getLockedStatus,
  setLockedPassword,
  verifyLockedPassword
} from "../services/notesApi";
import "../styles/lockedsectionmodal.css";

export default function LockedSectionModal({ onUnlock, onClose, onForgot }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [hasLockedPassword, setHasLockedPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStatus() {
      try {
        const res = await getLockedStatus();
        setHasLockedPassword(res.hasPassword);
      } catch {
        setHasLockedPassword(false);
      } finally {
        setLoading(false);
      }
    }
    loadStatus();
  }, []);

  async function handlePrimaryAction() {
    if (!password.trim()) {
      setError("Password required");
      return;
    }

    setError("");

    try {
      if (!hasLockedPassword) {
        await setLockedPassword(password.trim());
        setHasLockedPassword(true);
        setPassword("");
        onClose();
        return;
      }

      const success = await verifyLockedPassword(password.trim());
      if (!success) {
        setError("Incorrect password");
        return;
      }

      onUnlock(password.trim());
      onClose();
    } catch {
      setError("Unable to process request");
    }
  }

  if (loading) {
    return null;
  }

  return (
    <div className="locked-overlay">
      <div className="locked-modal">
        <div className="locked-modal-header">
          <button
            className="locked-close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="locked-modal-body">
          <h3>
            {hasLockedPassword
              ? "Unlock Locked Notes"
              : "Set Locked Section Password"}
          </h3>

          <input
            id="locked-section-password"
            name="lockedSectionPassword"
            type="password"
            placeholder={
              hasLockedPassword
                ? "Enter locked section password"
                : "Set locked section password"
            }
            value={password}
            autoComplete="new-password"
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
          />

          {hasLockedPassword && (
            <button
              className="link-button"
              onClick={onForgot}
            >
              Forgot locked password?
            </button>
          )}

          {error && (
            <div className="locked-error">
              {error}
            </div>
          )}
        </div>

        <div className="locked-modal-footer">
          <button
            className="locked-unlock-btn"
            onClick={handlePrimaryAction}
          >
            {hasLockedPassword ? "Unlock" : "Set Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
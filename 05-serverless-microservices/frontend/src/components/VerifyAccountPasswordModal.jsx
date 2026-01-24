import { useState } from "react";
import {
  verifyAccountPassword,
  setLockedPassword
} from "../services/notesApi";
import "../styles/verifyaccountmodal.css";

export default function VerifyAccountPasswordModal({ onVerified, onClose }) {
  const [accountPassword, setAccountPassword] = useState("");
  const [newLockedPassword, setNewLockedPassword] = useState("");
  const [confirmLockedPassword, setConfirmLockedPassword] = useState("");
  const [step, setStep] = useState("verify");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerifyAccountPassword(e) {
    e.preventDefault();

    if (!accountPassword) {
      setError("Account password is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await verifyAccountPassword(accountPassword);
      setAccountPassword("");
      setStep("set-new");
    } catch {
      setError("Incorrect account password");
    } finally {
      setLoading(false);
    }
  }

  async function handleSetNewLockedPassword(e) {
    e.preventDefault();

    if (!newLockedPassword || !confirmLockedPassword) {
      setError("Both fields are required");
      return;
    }

    if (newLockedPassword.length < 6) {
      setError("Locked password must be at least 6 characters");
      return;
    }

    if (newLockedPassword !== confirmLockedPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await setLockedPassword(newLockedPassword);
      onVerified();
    } catch {
      setError("Failed to set locked password");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setAccountPassword("");
    setNewLockedPassword("");
    setConfirmLockedPassword("");
    setError("");
    setStep("verify");
    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="verify-modal">
        <div className="verify-header">
          <h3>
            {step === "verify"
              ? "Verify Account Password"
              : "Set New Locked Password"}
          </h3>
          <button className="icon-btn" onClick={handleClose} disabled={loading}>
            ×
          </button>
        </div>

        <form
          className="verify-body"
          autoComplete="off"
          onSubmit={
            step === "verify"
              ? handleVerifyAccountPassword
              : handleSetNewLockedPassword
          }
        >

          <input
            id="hidden-username"
            name="username"
            type="text"
            autoComplete="username"
            tabIndex={-1}
            aria-hidden="true"
            style={{ display: "none" }}
          />

          <input
            id="hidden-current-password"
            name="current-password"
            type="password"
            autoComplete="current-password"
            tabIndex={-1}
            aria-hidden="true"
            style={{ display: "none" }}
          />

          {step === "verify" && (
            <input
              id="account-password"
              name="accountPassword"
              type="password"
              placeholder="Account password"
              value={accountPassword}
              autoComplete="current-password"
              onChange={(e) => {
                setAccountPassword(e.target.value);
                setError("");
              }}
            />
          )}

          {step === "set-new" && (
            <>
              <input
                id="new-locked-password"
                name="newLockedPassword"
                type="password"
                placeholder="New locked password"
                autoComplete="new-password"
                value={newLockedPassword}
                onChange={(e) => {
                  setNewLockedPassword(e.target.value);
                  setError("");
                }}
              />

              <input
                id="confirm-locked-password"
                name="confirmLockedPassword"
                type="password"
                placeholder="Confirm new locked password"
                autoComplete="new-password"
                value={confirmLockedPassword}
                onChange={(e) => {
                  setConfirmLockedPassword(e.target.value);
                  setError("");
                }}
              />
            </>
          )}

          {error && <div className="error-text">{error}</div>}

          <div className="verify-footer">
            <button className="save-btn" disabled={loading}>
              {loading
                ? "Processing..."
                : step === "verify"
                ? "Verify"
                : "Set Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
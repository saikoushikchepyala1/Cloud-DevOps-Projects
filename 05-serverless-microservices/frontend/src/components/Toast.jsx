import { useEffect } from "react";
import "../styles/toast.css";

export default function Toast({ message, onClose, duration = 2500 }) {
  useEffect(() => {
    if (!message || typeof message !== "string") return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message || typeof message !== "string") return null;

  return (
    <div className="toast-container">
      <div
        className="toast"
        role="alert"
        aria-live="assertive"
      >
        {message}
      </div>
    </div>
  );
}
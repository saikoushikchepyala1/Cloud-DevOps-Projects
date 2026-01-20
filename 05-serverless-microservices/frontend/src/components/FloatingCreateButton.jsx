import { Plus } from "lucide-react";
import "../styles/fab.css";

export default function FloatingCreateButton({ onClick }) {
  return (
    <button className="fab" onClick={onClick} aria-label="Create note">
      <Plus size={26} />
    </button>
  );
}
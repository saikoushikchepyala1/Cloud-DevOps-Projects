import "../styles/notesgrid.css";
import NoteCard from "./NoteCard";
import { FileText, Archive, Lock, Trash2 } from "lucide-react";

export default function NotesGrid({
  notes,
  activeView,
  onNoteClick,
  onRestore,
  onPermanentDelete
}) {
  if (notes.length === 0) {
    let icon = <FileText size={22} />;
    let message = "No notes yet";

    if (activeView === "archive") {
      icon = <Archive size={22} />;
      message = "Archive is empty";
    }

    if (activeView === "locked") {
      icon = <Lock size={22} />;
      message = "No locked notes";
    }

    if (activeView === "trash") {
      icon = <Trash2 size={22} />;
      message = "Trash is empty";
    }

    return (
      <div className="empty-state">
        <div className="empty-state-icon">{icon}</div>
        <div className="empty-state-text">{message}</div>
      </div>
    );
  }

  return (
    <div className="notes-grid">
      {notes.map(note => (
        <NoteCard
          key={note.noteId}
          note={note}
          onClick={() => onNoteClick(note)}
          onRestore={onRestore}
          onPermanentDelete={onPermanentDelete}
        />
      ))}
    </div>
  );
}
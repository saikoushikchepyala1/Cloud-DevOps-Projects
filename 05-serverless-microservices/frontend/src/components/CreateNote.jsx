import { useState, useEffect } from "react";
import {
  X,
  Palette,
  Type,
  CheckSquare,
  Image,
  Archive,
  Lock,
  Pin,
  Trash2,
} from "lucide-react";
import "../styles/createnote.css";

export default function CreateNote({
  note,
  onAddNote,
  onUpdateNote,
  onClose,
  showToast,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isArchived, setIsArchived] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setIsArchived(!!note.isArchived);
      setIsLocked(!!note.isLocked);
      setIsPinned(!!note.isPinned);
    }
  }, [note]);

  function handleSave() {
    if (!title && !content) return;

    const wasArchived = note?.isArchived;
    const wasLocked = note?.isLocked;

    const finalNote = {
      noteId: note?.noteId,
      title,
      content,
      isArchived,
      isLocked,
      isPinned,
      isDeleted: false,
      createdAt: note ? note.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    note ? onUpdateNote(finalNote) : onAddNote(finalNote);

    if (!note) showToast("Note created");
    else if (!wasArchived && isArchived) showToast("Note moved to Archive");
    else if (!wasLocked && isLocked) showToast("Note locked");
    else if ((wasArchived || wasLocked) && !isArchived && !isLocked) showToast("Note moved to Notes Section");
    else showToast("Note updated");

    onClose();
  }

  function handleDelete() {
    if (!note) return;

    const deletedNote = {
      ...note,
      isDeleted: true,
      deletedFrom: note.isLocked
        ? "locked"
        : note.isArchived
        ? "archive"
        : "notes",
      isArchived: false,
      isLocked: false,
      updatedAt: new Date().toISOString(),
    };

    onUpdateNote(deletedNote);
    showToast("Note moved to Trash");
    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="note-modal">
        <div className="note-header">
          <button
            className={`icon-btn ${isPinned ? "active" : ""}`}
            onClick={() => setIsPinned(!isPinned)}
          >
            <Pin size={20} />
          </button>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="note-body">
          <input
            id="note-title"
            name="note-title"
            className="note-title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            id="note-content"
            name="note-content"
            className="note-text"
            placeholder="Take a note…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="note-footer">
          <div className="note-actions">
            <button className="icon-btn"><Palette size={20} /></button>
            <button className="icon-btn"><Type size={20} /></button>
            <button className="icon-btn"><CheckSquare size={20} /></button>
            <button className="icon-btn"><Image size={20} /></button>

            <button
              className={`icon-btn ${isArchived ? "active" : ""}`}
              onClick={() => {
                setIsArchived(!isArchived);
                setIsLocked(false);
              }}
            >
              <Archive size={20} />
            </button>

            <button
              className={`icon-btn ${isLocked ? "active" : ""}`}
              onClick={() => {
                setIsLocked(!isLocked);
                setIsArchived(false);
              }}
            >
              <Lock size={20} />
            </button>

            {note && (
              <button className="icon-btn" onClick={handleDelete}>
                <Trash2 size={20} />
              </button>
            )}
          </div>

          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
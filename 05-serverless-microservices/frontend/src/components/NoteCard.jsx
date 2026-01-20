import "../styles/notecard.css";

export default function NoteCard({
  note,
  onClick,
  onRestore,
  onPermanentDelete
}) {
  const isTrash = note.isDeleted;

  return (
    <div
      className={`note-card ${isTrash ? "trash-card" : ""}`}
      onClick={!isTrash ? onClick : undefined}
    >
      {note.isPinned && !isTrash && (
        <div className="note-pin-indicator">Pinned</div>
      )}

      {note.title && (
        <h3 className="note-title">{note.title}</h3>
      )}

      <p className="note-content">{note.content}</p>

      {isTrash && (
        <div className="trash-actions">
          <button
            className="restore-btn"
            onClick={() => onRestore(note)}
          >
            Restore
          </button>

          <button
            className="delete-forever-btn"
            onClick={() => {
              if (
                window.confirm(
                  "This note will be permanently deleted. This action cannot be undone."
                )
              ) {
                onPermanentDelete(note.noteId);
              }
            }}
          >
            Delete Forever
          </button>
        </div>
      )}
    </div>
  );
}
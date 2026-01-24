import { useEffect, useState } from "react"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import NotesGrid from "../components/NotesGrid"
import CreateNote from "../components/CreateNote"
import FloatingCreateButton from "../components/FloatingCreateButton"
import LockedSectionModal from "../components/LockedSectionModal"
import VerifyAccountPasswordModal from "../components/VerifyAccountPasswordModal"
import {
  fetchNotes,
  createNote,
  updateNote as updateNoteApi,
  deleteNote as deleteNoteApi,
  verifyLockedPassword
} from "../services/notesApi"
import "../styles/notespage.css"

export default function NotesPage({
  user,
  signOut,
  notes,
  setNotes,
  showToast,
  lockedUnlocked,
  setLockedUnlocked
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [activeView, setActiveView] = useState("notes")
  const [searchQuery, setSearchQuery] = useState("")
  const [showLockedModal, setShowLockedModal] = useState(false)
  const [showVerifyModal, setShowVerifyModal] = useState(false)

  const userId =
    user?.attributes?.sub ||
    user?.signInDetails?.loginId ||
    user?.username

  useEffect(() => {
    setNotes([])
    setLockedUnlocked(false)
    setActiveView("notes")

    fetchNotes()
      .then(setNotes)
      .catch(() => showToast("Failed to load notes"))
  }, [userId])

  async function addNote(note) {
    const tempNote = { ...note, noteId: Date.now().toString() }
    setNotes(prev => [tempNote, ...prev])
    showToast("Note created")

    try {
      const saved = await createNote(note)
      setNotes(prev =>
        prev.map(n => n.noteId === tempNote.noteId ? saved : n)
      )
    } catch {
      setNotes(prev => prev.filter(n => n.noteId !== tempNote.noteId))
      showToast("Failed to create note")
    }
  }

  function updateNote(updatedNote) {
    const oldNotes = [...notes]
    setNotes(prev =>
      prev.map(n => n.noteId === updatedNote.noteId ? updatedNote : n)
    )

    updateNoteApi(updatedNote).catch(() => {
      setNotes(oldNotes)
      showToast("Failed to update note")
    })
  }

  function openCreate() {
    setEditingNote(null)
    setShowCreate(true)
  }

  function openEdit(note) {
    if (note.isDeleted) return

    if (note.isLocked && activeView !== "locked") {
      setShowLockedModal(true)
      return
    }

    setEditingNote(note)
    setShowCreate(true)
  }

  async function unlockLockedSection(password) {
    try {
      const success = await verifyLockedPassword(password)
      if (!success) {
        showToast("Incorrect password")
        return
      }

      setLockedUnlocked(true)
      setActiveView("locked")
      setShowLockedModal(false)
    } catch {
      showToast("Error unlocking locked section")
    }
  }

  function restoreNote(note) {
    const oldNotes = [...notes]
    const restored = {
      ...note,
      isDeleted: false,
      isLocked: note.deletedFrom === "locked",
      isArchived: note.deletedFrom === "archive",
      deletedFrom: null,
      updatedAt: new Date().toISOString()
    }

    setNotes(prev =>
      prev.map(n => n.noteId === restored.noteId ? restored : n)
    )

    updateNoteApi(restored).catch(() => {
      setNotes(oldNotes)
      showToast("Failed to restore note")
    })

    showToast("Note restored")
  }

  function permanentlyDeleteNote(noteId) {
    const oldNotes = [...notes]
    setNotes(prev => prev.filter(n => n.noteId !== noteId))

    deleteNoteApi(noteId).catch(() => {
      setNotes(oldNotes)
      showToast("Failed to delete note")
    })

    showToast("Note permanently deleted")
  }

  const viewFilteredNotes = notes.filter(note => {
    if (activeView === "notes")
      return !note.isArchived && !note.isLocked && !note.isDeleted
    if (activeView === "archive")
      return note.isArchived && !note.isDeleted
    if (activeView === "locked")
      return note.isLocked && !note.isDeleted
    if (activeView === "trash")
      return note.isDeleted
    return false
  })

  const visibleNotes = viewFilteredNotes
    .filter(
      note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  return (
    <div className="app-layout">
      <Header
        onToggleSidebar={() => setCollapsed(!collapsed)}
        userEmail={
          user?.attributes?.email ||
          user?.signInDetails?.loginId ||
          user?.username
        }
        onLogout={() => {
          setNotes([])
          setLockedUnlocked(false)
          signOut()
        }}
      />

      <div className="app-body">
        <Sidebar
          collapsed={collapsed}
          activeView={activeView}
          onChangeView={view => {
            if (activeView === "locked" && view !== "locked") {
              setLockedUnlocked(false)
            }

            if (view === "locked" && !lockedUnlocked) {
              setShowLockedModal(true)
              return
            }

            setActiveView(view)
          }}
        />

        <main className="content">
          <div className="search-bar">
            <input
              id="notes-search"
              name="notes-search"
              type="search"
              placeholder="Search notes..."
              value={searchQuery}
              autoComplete="off"
              spellCheck={false}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <NotesGrid
            notes={visibleNotes}
            activeView={activeView}
            onNoteClick={openEdit}
            onRestore={activeView === "trash" ? restoreNote : null}
            onPermanentDelete={
              activeView === "trash" ? permanentlyDeleteNote : null
            }
          />

          {showCreate && (
            <CreateNote
              note={editingNote}
              onAddNote={addNote}
              onUpdateNote={updateNote}
              onClose={() => setShowCreate(false)}
              showToast={showToast}
            />
          )}

          {showLockedModal && (
            <LockedSectionModal
              onUnlock={unlockLockedSection}
              onForgot={() => {
                setShowLockedModal(false)
                setShowVerifyModal(true)
              }}
              onClose={() => setShowLockedModal(false)}
            />
          )}

          {showVerifyModal && (
            <VerifyAccountPasswordModal
              onVerified={() => {
                setLockedUnlocked(false)
                setActiveView("notes")
                showToast("Locked section password reset successfully")
                setShowVerifyModal(false)
              }}
              onClose={() => setShowVerifyModal(false)}
            />
          )}
        </main>
      </div>

      <FloatingCreateButton onClick={openCreate} />
    </div>
  )
}
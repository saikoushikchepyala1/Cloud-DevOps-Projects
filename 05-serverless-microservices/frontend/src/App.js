import { useState } from "react";
import AuthWrapper from "./auth/AuthWrapper";
import NotesPage from "./pages/NotesPage";
import Toast from "./components/Toast";

export default function App() {
  const [toastMessage, setToastMessage] = useState("");
  const [notes, setNotes] = useState([]);
  const [lockedUnlocked, setLockedUnlocked] = useState(false);

  function showToast(message) {
    setToastMessage(message);
  }

  function clearToast() {
    setToastMessage("");
  }

  return (
    <>
      <AuthWrapper>
        {({ user, signOut }) => (
          <NotesPage
            user={user}
            signOut={() => {
              setNotes([]);
              setLockedUnlocked(false);
              signOut();
            }}
            notes={notes}
            setNotes={setNotes}
            showToast={showToast}
            lockedUnlocked={lockedUnlocked}
            setLockedUnlocked={setLockedUnlocked}
          />
        )}
      </AuthWrapper>

      <Toast message={toastMessage} onClose={clearToast} />
    </>
  );
}
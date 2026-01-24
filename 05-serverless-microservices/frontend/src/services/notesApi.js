import { fetchAuthSession } from "aws-amplify/auth";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

async function getAuthHeader() {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
}

export async function fetchNotes() {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE_URL}/notes`, { headers });
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
}

export async function createNote(note) {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE_URL}/notes`, {
    method: "POST",
    headers,
    body: JSON.stringify(note)
  });
  if (!res.ok) throw new Error("Failed to create note");
  return res.json();
}

export async function updateNote(note) {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE_URL}/notes`, {
    method: "PUT",
    headers,
    body: JSON.stringify(note)
  });
  if (!res.ok) throw new Error("Failed to update note");
  return res.json();
}

export async function deleteNote(noteId) {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE_URL}/notes?noteId=${noteId}`, {
    method: "DELETE",
    headers
  });
  if (!res.ok) throw new Error("Failed to delete note");
}

export async function getLockedStatus() {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE_URL}/security/locked`, {
    method: "GET",
    headers
  });
  if (!res.ok) throw new Error("Failed to fetch locked status");
  return res.json();
}

export async function setLockedPassword(password) {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE_URL}/security/locked`, {
    method: "POST",
    headers,
    body: JSON.stringify({ action: "set", password })
  });
  if (!res.ok) throw new Error("Failed to set password");
}

export async function verifyAccountPassword(accountPassword) {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE_URL}/security/locked`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      action: "verifyAccount",
      accountPassword
    })
  });

  if (!res.ok) {
    throw new Error("Account verification failed");
  }

  return res.json();
}

export async function verifyLockedPassword(password) {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE_URL}/security/locked`, {
    method: "POST",
    headers,
    body: JSON.stringify({ action: "verify", password })
  });
  return res.ok;
}
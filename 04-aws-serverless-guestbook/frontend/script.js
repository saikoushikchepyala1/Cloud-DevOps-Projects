const API_URL = "https://b5prxo0sb2.execute-api.eu-north-1.amazonaws.com/prod/messages";

let messagesVisible = false;

async function loadMessages() {
  const res = await fetch(API_URL);
  const data = await res.json();

  const container = document.getElementById("messages");
  container.innerHTML = ""; 

  data.forEach(item => {
    container.innerHTML += `
      <div class="message-row">
        <div class="message-name">${item.name || "Anonymous"}</div>
        <div class="message-text">${item.message}</div>
      </div>
    `;
  });
}


async function toggleMessages() {
  const container = document.getElementById("messages");

  if (messagesVisible) {
    container.style.display = "none";
    messagesVisible = false;
  } else {
    await loadMessages();
    container.style.display = "block";
    messagesVisible = true;
  }
}

async function submitMessage() {
  const nameInput = document.getElementById("name");
  const messageInput = document.getElementById("message");
  const status = document.getElementById("status");

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (!name || !message) {
    status.innerText = "Please fill in both fields.";
    status.style.color = "red";
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, message })
  });

  nameInput.value = "";
  messageInput.value = "";

  status.innerText = "Message submitted successfully.";
  status.style.color = "green";

  if (messagesVisible) {
    loadMessages();
  }
}

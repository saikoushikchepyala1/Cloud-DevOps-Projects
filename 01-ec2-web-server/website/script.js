function startTask() {
  document.getElementById("flow").classList.remove("hidden");
  document.getElementById("step-1").classList.remove("hidden");
}

function showStep(step) {
  document.getElementById(`arrows-${step - 1}`).classList.remove("hidden");
  document.getElementById(`step-${step}`).classList.remove("hidden");
}

function completeTask() {
  document.getElementById("completion").classList.remove("hidden");
}

export function toggleForm(containerId, formHTML, submitCallback) {
  const container = document.getElementById(containerId);
  if (container.classList.contains("hidden")) {
    container.innerHTML = formHTML;
    container.classList.remove("hidden");
    const form = container.querySelector("form");
    if (form) {
      form.addEventListener("submit", submitCallback);
    }
  } else {
    container.innerHTML = "";
    container.classList.add("hidden");
  }
}

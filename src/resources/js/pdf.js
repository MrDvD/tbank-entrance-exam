export function initPdfButton() {
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector("#pdf-button");
    button.addEventListener("click", () => {
      alert("Hello!");
    });
  });
}
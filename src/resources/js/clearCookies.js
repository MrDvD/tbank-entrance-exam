export function initClearCookies() {
  document.addEventListener('DOMContentLoaded', () => {
    const clearButton = document.querySelector('.header button');
    clearButton.onclick = function() {
      clearCookies();
    };
  });
}

function clearCookies() {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  }
  location.reload();
}
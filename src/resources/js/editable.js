export function initEditableTexts() {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll("h1, h2, h3, h4, p").forEach(element => {
      element.ondblclick = function() {
        replaceWithInput(element);
      }
    });
  });
}

function replaceWithInput(element) {
  if (element.querySelector('textarea')) {
    element.querySelector('textarea').focus();
    return;
  }

  const originalText = element.innerHTML;
  const inputField = document.createElement('textarea');
  inputField.value = originalText;
  inputField.className = 'inheritable-input';

  element.innerHTML = '';
  element.appendChild(inputField);
  inputField.focus();

  inputField.onblur = function() {
    element.innerHTML = originalText;
    if (inputField.value.trim() !== "") {
      element.textContent = inputField.value;
      saveTextToCookie(getElementIdentifier(element), inputField.value);
    }
  };

  inputField.onkeydown = function(event) {
    if (event.key === 'Enter') {
      inputField.blur();
    }
  };
}

function getElementIdentifier(element) {
  if (element.id) return element.id;
  const tag = element.tagName;
  const index = Array.from(document.querySelectorAll(tag)).indexOf(element);
  return `${tag}_${index}`;
}

function saveTextToCookie(key, value) {
  document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; path=/`;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll("h1, h2, h3, h4, p").forEach(element => {
    const key = getElementIdentifier(element);
    const match = document.cookie.match(new RegExp('(^| )' + encodeURIComponent(key) + '=([^;]+)'));
    if (match) {
      element.textContent = decodeURIComponent(match[2]);
    }
  });
});
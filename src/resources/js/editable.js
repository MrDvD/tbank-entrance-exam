export function initEditableTexts() {
  document.addEventListener("DOMContentLoaded", () => {
    document
      .querySelectorAll("h1, h2, h3, h4, h5, h6, p")
      .forEach((element) => {
        element.ondblclick = function () {
          // desktop
          replaceWithInput(element);
        };
        let lastTap = 0;
        element.ontouchend = function (e) {
          // mobile
          const currentTime = new Date().getTime();
          if (currentTime - lastTap < 300) {
            replaceWithInput(element);
            e.preventDefault();
          }
          lastTap = currentTime;
        };
      });
  });
}

function replaceWithInput(element) {
  if (element.querySelector("textarea")) {
    element.querySelector("textarea").focus();
    element.scrollLeft = 0;
    return;
  }

  const originalText = element.innerHTML;
  const inputField = document.createElement("textarea");
  inputField.value = originalText;
  inputField.className = "inheritable-input";

  element.innerHTML = "";
  element.appendChild(inputField);
  inputField.focus();

  inputField.onblur = function () {
    element.innerHTML = originalText;
  };

  inputField.onkeydown = function (event) {
    if (event.key === "Enter") {
      inputField.blur();
      if (inputField.value.trim() !== "") {
        element.textContent = inputField.value;
        saveTextToCookie(getElementIdentifier(element), inputField.value);
        element.scrollLeft = 0;
      }
    }
  };
}

export function getElementIdentifier(element) {
  if (element.id) {
    return element.id;
  }
  const tag = element.tagName;
  const index = Array.from(document.querySelectorAll(tag)).indexOf(element);
  return `${tag}_${index}`;
}

function saveTextToCookie(key, value) {
  document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; path=/`;
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    document
      .querySelectorAll("h1, h2, h3, h4, h5, h6, p")
      .forEach((element) => {
        const key = getElementIdentifier(element);
        const match = document.cookie.match(
          new RegExp("(^| )" + encodeURIComponent(key) + "=([^;]+)"),
        );
        if (match) {
          element.textContent = decodeURIComponent(match[2]);
        }
      });
  });
}

const rippleElementSelectors = [".card", ".button"];

export function initRipples() {
  document.addEventListener("DOMContentLoaded", () => {
    rippleElementSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((elem) => {
        elem.addEventListener("pointerdown", function (event) {
          if (event.target !== elem) {
            return;
          }

          const ripple = document.createElement("div");
          ripple.className = "ripple";

          const x = event.offsetX;
          const y = event.offsetY;
          ripple.style.left = `${x}px`;
          ripple.style.top = `${y}px`;

          elem.appendChild(ripple);

          requestAnimationFrame(() => {
            ripple.classList.add("run");
          });

          ripple.addEventListener("transitionend", () => {
            ripple.remove();
          });
        });
      });
    });
  });
}

// Tracks whether the visitor's last input was the keyboard, so programmatic focus (e.g. the genre heading
// after a route change) can show a focus ring for keyboard users only. `:focus-visible` alone doesn't
// match focus set from an effect after navigation.
let keyboard = false;
let installed = false;

/** Idempotent; call from a component that is mounted from the first page load. */
export function installInputModality() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  window.addEventListener("keydown", () => (keyboard = true), true);
  window.addEventListener("pointerdown", () => (keyboard = false), true);
}

export const lastInputWasKeyboard = () => keyboard;

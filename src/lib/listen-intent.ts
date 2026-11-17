/**
 * "The visitor wants to listen" (#67, docs/prd.md › Autoplay): marked by Randomize / Space / Roll again and the crate
 * sleeve's Play right before they navigate; read by the genre page (to autoplay track 01) and cleared on its mount.
 * In memory only, so a shared URL or a reload (a fresh page) never autoplays, and neither does History.
 * Reading is pure on purpose: React may call state initializers twice (StrictMode).
 */
let intent = false;

export function markListenIntent() {
  intent = true;
}

export function hasListenIntent() {
  return intent;
}

export function clearListenIntent() {
  intent = false;
}

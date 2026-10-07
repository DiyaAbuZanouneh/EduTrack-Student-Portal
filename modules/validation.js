// validation.js - form rules and error helpers
// Each validate function returns an error message, or "" if the value is OK.

export function validateFullName(value) {
  return value.trim() ? "" : "Full name is required.";
}

export function validateEmail(value) {
  if (!value.trim()) return "Email is required.";
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  return ok ? "" : "Enter a valid email address.";
}

export function validateStudentId(value) {
  return value.trim() ? "" : "Student ID is required.";
}

export function validatePassword(value) {
  return value ? "" : "Password is required.";
}

export function validateConfirmPassword(password, confirm) {
  if (!confirm) return "Please confirm your password.";
  return password === confirm ? "" : "Passwords do not match.";
}

/* ---------- UI helpers ---------- */

// Shows an error under an input ("" clears it) + red border
export function setFieldError(input, message) {
  input.closest(".field").querySelector(".field-error").textContent = message;
  input.classList.toggle("invalid", Boolean(message));
}

// Removes all error messages and red borders from a form
export function clearErrors(form) {
  form.querySelectorAll(".field-error").forEach((el) => (el.textContent = ""));
  form
    .querySelectorAll(".invalid")
    .forEach((el) => el.classList.remove("invalid"));
}

// Makes every "Show/Hide" password button work
export function initPasswordToggles() {
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.parentElement.querySelector("input");
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.textContent = show ? "Hide" : "Show";
    });
  });
}

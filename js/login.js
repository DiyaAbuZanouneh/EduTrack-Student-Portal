// login.js - Login page

import { getUserByEmail } from "../modules/api.js";
import {
  redirectIfLoggedIn,
  passwordMatches,
  saveSession,
} from "../modules/auth.js";
import {
  validateEmail,
  validatePassword,
  setFieldError,
  initPasswordToggles,
} from "../modules/validation.js";

redirectIfLoggedIn();
initPasswordToggles();

const form = document.getElementById("login-form");
const formError = document.getElementById("form-error");

function showError(message) {
  formError.textContent = message;
  formError.hidden = !message;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  showError("");
  const { email, password, remember } = form.elements;

  // 1. Validate
  const emailError = validateEmail(email.value);
  const passwordError = validatePassword(password.value);
  setFieldError(email, emailError);
  setFieldError(password, passwordError);
  if (emailError || passwordError) return;

  try {
    // 2. Check email + password (one message for both, for security)
    const user = await getUserByEmail(email.value.trim().toLowerCase());
    if (!user || !(await passwordMatches(password.value, user.password))) {
      showError("Incorrect email or password. Please try again.");
      return;
    }

    // 3. Save session and go to the dashboard
    saveSession(user, remember.checked);
    location.href = "dashboard.html";
  } catch {
    showError("Something went wrong. Is json-server running?");
  }
});

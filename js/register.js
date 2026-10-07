// register.js - Registration page

import {
  getUserByEmail,
  getUserByStudentId,
  createUser,
} from "../modules/api.js";
import { redirectIfLoggedIn, hashPassword } from "../modules/auth.js";
import {
  validateFullName,
  validateEmail,
  validateStudentId,
  validatePassword,
  validateConfirmPassword,
  setFieldError,
  initPasswordToggles,
} from "../modules/validation.js";

redirectIfLoggedIn();
initPasswordToggles();

const form = document.getElementById("register-form");
const formError = document.getElementById("form-error");

function showError(message) {
  formError.textContent = message;
  formError.hidden = !message;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  showError("");
  const { fullName, email, studentId, password, confirmPassword } =
    form.elements;

  // Clean values: email lowercase, Student ID uppercase
  const emailValue = email.value.trim().toLowerCase();
  const idValue = studentId.value.trim().toUpperCase();

  // 1. Validate (each is an error message or "")
  const errors = {
    fullName: validateFullName(fullName.value),
    email: validateEmail(email.value),
    studentId: validateStudentId(studentId.value),
    password: validatePassword(password.value),
    confirmPassword: validateConfirmPassword(
      password.value,
      confirmPassword.value,
    ),
  };

  try {
    // 2. Check that email and Student ID are not already used
    if (!errors.email && (await getUserByEmail(emailValue))) {
      errors.email = "This email is already registered.";
    }
    if (!errors.studentId && (await getUserByStudentId(idValue))) {
      errors.studentId = "This Student ID is already registered.";
    }

    // 3. Show errors; stop if there is any
    setFieldError(fullName, errors.fullName);
    setFieldError(email, errors.email);
    setFieldError(studentId, errors.studentId);
    setFieldError(password, errors.password);
    setFieldError(confirmPassword, errors.confirmPassword);
    if (Object.values(errors).some(Boolean)) return;

    // 4. Save (password is hashed) and go to login
    await createUser({
      fullName: fullName.value.trim(),
      email: emailValue,
      studentId: idValue,
      password: await hashPassword(password.value),
    });
    location.href = "login.html";
  } catch {
    showError("Something went wrong. Is json-server running?");
  }
});

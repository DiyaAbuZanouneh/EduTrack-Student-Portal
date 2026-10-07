// dashboard.js - welcome message, profile view/edit, courses, logout

import {
  getUserByEmail,
  getUserByStudentId,
  updateUser,
  getEnrollments,
} from "../modules/api.js";
import {
  requireAuth,
  logout,
  updateSession,
  startInactivityTimer,
} from "../modules/auth.js";
import {
  validateFullName,
  validateEmail,
  validateStudentId,
  setFieldError,
  clearErrors,
} from "../modules/validation.js";

const session = requireAuth();
if (session) init();

// Creates an element with a class and text (textContent keeps data safe from HTML injection)
function create(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

async function init() {
  startInactivityTimer();

  const $ = (id) => document.getElementById(id);
  const profileForm = $("profile-form");
  const formError = $("form-error");
  let user;

  $("logout-btn").addEventListener("click", logout);

  function renderProfile() {
    $("welcome").textContent = `Welcome, ${user.fullName}`;
    $("view-name").textContent = user.fullName;
    $("view-email").textContent = user.email;
    $("view-student-id").textContent = user.studentId;
  }

  // Switch between the read-only profile and the edit form
  function showEdit(editing) {
    $("profile-view").hidden = editing;
    profileForm.hidden = !editing;
    formError.hidden = true;
    if (editing) {
      clearErrors(profileForm);
      profileForm.elements.fullName.value = user.fullName;
      profileForm.elements.email.value = user.email;
      profileForm.elements.studentId.value = user.studentId;
    }
  }

  // Table rows (desktop) + cards (mobile)
  async function loadCourses() {
    try {
      const enrollments = await getEnrollments(session.id);
      enrollments.forEach(({ course, score }) => {
        const row = create("tr");
        [course.name, course.teacher, score].forEach((text) =>
          row.append(create("td", "", text)),
        );
        $("courses-body").append(row);

        const head = create("div", "course-card-head");
        head.append(
          create("span", "", course.name),
          create("span", "course-score", score),
        );
        const card = create("div", "course-card");
        card.append(head, create("p", "", course.teacher));
        $("courses-cards").append(card);
      });
    } catch {
      $("courses-error").hidden = false;
    }
  }

  // Load the latest user data
  try {
    user = await getUserByEmail(session.email);
    renderProfile();
  } catch {
    $("welcome").textContent = `Welcome, ${session.name}`;
    $("profile-error").hidden = false;
    return;
  }
  loadCourses();

  $("edit-btn").addEventListener("click", () => showEdit(true));
  $("cancel-btn").addEventListener("click", () => showEdit(false));

  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    formError.hidden = true;
    const { fullName, email, studentId } = profileForm.elements;
    const newEmail = email.value.trim().toLowerCase();
    const newId = studentId.value.trim().toUpperCase();

    // 1. Validate
    const errors = {
      fullName: validateFullName(fullName.value),
      email: validateEmail(email.value),
      studentId: validateStudentId(studentId.value),
    };

    try {
      // 2. Email / Student ID must not belong to ANOTHER user
      if (!errors.email) {
        const other = await getUserByEmail(newEmail);
        if (other && other.id !== user.id)
          errors.email = "This email is already registered.";
      }
      if (!errors.studentId) {
        const other = await getUserByStudentId(newId);
        if (other && other.id !== user.id)
          errors.studentId = "This Student ID is already registered.";
      }

      // 3. Show errors; stop if there is any
      setFieldError(fullName, errors.fullName);
      setFieldError(email, errors.email);
      setFieldError(studentId, errors.studentId);
      if (Object.values(errors).some(Boolean)) return;

      // 4. Save, then update session and screen
      user = await updateUser(user.id, {
        fullName: fullName.value.trim(),
        email: newEmail,
        studentId: newId,
      });
      updateSession({ name: user.fullName, email: user.email });
      renderProfile();
      showEdit(false);
    } catch {
      formError.textContent = "Could not save changes. Please try again.";
      formError.hidden = false;
    }
  });
}

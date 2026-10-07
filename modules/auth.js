// auth.js - password hashing, session, page guards, auto-logout

const SESSION_KEY = "edutrack_session";

/* ---------- Passwords ---------- */

// SHA-256 hash as a hex string
export async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Accepts hashed passwords and plain-text ones already in db.json
export async function passwordMatches(input, stored) {
  return stored === input || stored === (await hashPassword(input));
}

/* ---------- Session ---------- */

// remember = true -> localStorage, false -> sessionStorage
export function saveSession(user, remember) {
  clearSession();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(
    SESSION_KEY,
    JSON.stringify({ id: user.id, name: user.fullName, email: user.email }),
  );
}

export function getSession() {
  try {
    return JSON.parse(
      localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY),
    );
  } catch {
    return null;
  }
}

export function updateSession(changes) {
  const storage = localStorage.getItem(SESSION_KEY)
    ? localStorage
    : sessionStorage;
  storage.setItem(SESSION_KEY, JSON.stringify({ ...getSession(), ...changes }));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

export function logout() {
  clearSession();
  location.href = "login.html";
}

/* ---------- Page guards ---------- */

// Dashboard: returns the session, or goes to login (returns null)
export function requireAuth() {
  const session = getSession();
  if (!session) location.replace("login.html");
  return session;
}

// Login/Register: logged-in users go to the dashboard
export function redirectIfLoggedIn() {
  if (getSession()) location.replace("dashboard.html");
}

/* ---------- Auto-logout ---------- */

// Logs out after 30 minutes without activity
export function startInactivityTimer() {
  let timer;
  const reset = () => {
    clearTimeout(timer);
    timer = setTimeout(logout, 30 * 60 * 1000);
  };
  ["click", "keydown", "mousemove", "scroll", "touchstart"].forEach((e) =>
    document.addEventListener(e, reset),
  );
  reset();
}

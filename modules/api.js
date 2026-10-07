// api.js - all communication with json-server

const BASE_URL = "http://localhost:3000";

async function request(path, method = "GET", data) {
  const res = await fetch(BASE_URL + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: data && JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

// Returns the user with this email, or undefined
export async function getUserByEmail(email) {
  const users = await request(`/users?email=${encodeURIComponent(email)}`);
  return users[0];
}

// Returns the user with this Student ID, or undefined
export async function getUserByStudentId(studentId) {
  const users = await request(
    `/users?studentId=${encodeURIComponent(studentId)}`,
  );
  return users[0];
}

export function createUser(user) {
  return request("/users", "POST", user);
}

export function updateUser(id, data) {
  return request(`/users/${id}`, "PATCH", data);
}

// Courses of one student (each enrollment has score + the full course object)
export function getEnrollments(userId) {
  return request(`/enrollments?userId=${userId}&_expand=course`);
}

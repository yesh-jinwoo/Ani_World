import { ApiError, ensureCsrfToken } from "../api/api.js";

export function setMessage(element, message, success = false) {
  element.textContent = message;
  element.hidden = false;
  element.classList.toggle("is-success", success);
}

export function setSubmitting(button, submitting, label) {
  button.disabled = submitting;
  button.textContent = submitting ? "Please wait…" : label;
}

export function readableError(error) {
  if (!(error instanceof ApiError)) return "Something went wrong. Please try again.";
  const entries = Object.entries(error.details).filter(([key]) => key !== "detail");
  if (entries.length) return entries.map(([field, messages]) => `${field.replace("_", " ")}: ${Array.isArray(messages) ? messages.join(" ") : messages}`).join(" ");
  return error.message;
}

export async function prepareSecureRequest() { await ensureCsrfToken(); }

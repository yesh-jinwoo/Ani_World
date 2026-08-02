import { ApiError, ensureCsrfToken } from "../api/api.js";

export function setMessage(element, message, success = false) {
  element.textContent = message;
  element.hidden = false;
  element.classList.toggle("is-success", success);
}

export function setSubmitting(button, submitting, label) {
  button.disabled = submitting;
  button.textContent = submitting ? "Please wait…" : label;
  button.classList.toggle("is-loading", submitting);
  button.setAttribute("aria-busy", String(submitting));
}

export function readableError(error) {
  if (!(error instanceof ApiError)) return "Something went wrong. Please try again.";
  const entries = Object.entries(error.details).filter(([key]) => key !== "detail");
  if (entries.length) return entries.map(([field, messages]) => `${field.replace("_", " ")}: ${Array.isArray(messages) ? messages.join(" ") : messages}`).join(" ");
  return error.message;
}

export function renderApiErrors(form, messageElement, error) {
  form.querySelectorAll(".field-error").forEach((element) => element.remove());
  form.querySelectorAll("[aria-invalid]").forEach((element) => element.removeAttribute("aria-invalid"));
  if (!(error instanceof ApiError)) { setMessage(messageElement, readableError(error)); return; }
  const entries = Object.entries(error.details).filter(([field]) => !["detail", "non_field_errors"].includes(field));
  for (const [field, errors] of entries) {
    const input = form.elements.namedItem(field);
    if (!input) continue;
    input.setAttribute("aria-invalid", "true");
    const errorText = document.createElement("p");
    errorText.className = "field-error";
    errorText.textContent = Array.isArray(errors) ? errors.join(" ") : errors;
    input.insertAdjacentElement("afterend", errorText);
  }
  if (entries.length) { setMessage(messageElement, "Please correct the highlighted fields."); return; }
  setMessage(messageElement, error.details.non_field_errors?.[0] || error.message);
}

export async function prepareSecureRequest() { await ensureCsrfToken(); }

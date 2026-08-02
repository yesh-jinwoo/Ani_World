export function playAuthSuccess({ title, message }) {
  const sequence = document.createElement("section");
  sequence.className = "success-sequence";
  sequence.setAttribute("role", "status");
  sequence.setAttribute("aria-live", "assertive");
  sequence.innerHTML = `<div class="success-portal" aria-hidden="true"><span></span><span></span><span></span><i></i><i></i><i></i><i></i><i></i></div><div class="success-copy"><p>Authentication complete</p><h1>${title}</h1><span>${message}</span></div>`;
  document.body.append(sequence);
  requestAnimationFrame(() => sequence.classList.add("is-active"));
  const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 250 : 2900;
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

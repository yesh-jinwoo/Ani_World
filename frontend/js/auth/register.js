import { authApi } from "../api/api.js";
import { prepareSecureRequest, readableError, setMessage, setSubmitting } from "./form.js";

const form = document.querySelector("#register-form");
const message = document.querySelector("#form-message");
const submit = form.querySelector("button[type=submit]");

prepareSecureRequest().catch((error) => setMessage(message, readableError(error)));
form.addEventListener("submit", async (event) => {
  event.preventDefault(); message.hidden = true;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  if (data.get("password") !== data.get("confirm_password")) { setMessage(message, "Confirm password: passwords do not match."); return; }
  setSubmitting(submit, true, "Join AniWorld →");
  try {
    await authApi.register(Object.fromEntries(data));
    setMessage(message, "Your account is ready. You are now signed in.", true);
    form.reset();
  } catch (error) { setMessage(message, readableError(error)); }
  finally { setSubmitting(submit, false, "Join AniWorld →"); }
});

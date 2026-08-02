import { authApi } from "../api/api.js";
import { prepareSecureRequest, readableError, setMessage, setSubmitting } from "./form.js";

const form = document.querySelector("#login-form");
const message = document.querySelector("#form-message");
const submit = form.querySelector("button[type=submit]");

prepareSecureRequest().catch((error) => setMessage(message, readableError(error)));
form.addEventListener("submit", async (event) => {
  event.preventDefault(); message.hidden = true;
  if (!form.reportValidity()) return;
  setSubmitting(submit, true, "Log in →");
  try {
    const data = new FormData(form);
    await authApi.login({ identifier: data.get("identifier"), password: data.get("password"), remember_me: data.get("remember_me") === "on" });
    setMessage(message, "Signed in successfully. Your dashboard is coming in Phase 8.", true);
    form.reset();
  } catch (error) { setMessage(message, readableError(error)); }
  finally { setSubmitting(submit, false, "Log in →"); }
});

import { authApi } from "../api/api.js";
import { prepareSecureRequest, readableError, renderApiErrors, setMessage, setSubmitting } from "./form.js";
import { playAuthSuccess } from "./success.js";

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
    await playAuthSuccess({ title: "Welcome back, hunter.", message: "Your world is opening." });
    window.location.assign("dashboard.html");
  } catch (error) { renderApiErrors(form, message, error); }
  finally { setSubmitting(submit, false, "Log in →"); }
});

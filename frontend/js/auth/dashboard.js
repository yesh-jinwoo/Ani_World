import { ApiError, authApi, ensureCsrfToken } from "../api/api.js";

const username = document.querySelector("#username");
const status = document.querySelector("#dashboard-status");
const logoutButton = document.querySelector("#logout-button");

async function loadCurrentUser() {
  try {
    const { user } = await authApi.currentUser();
    username.textContent = user.username;
    status.textContent = "Your session is secure. Choose your next world.";
  } catch (error) {
    status.textContent = "We could not load your session. Redirecting to sign in…";
    window.setTimeout(() => window.location.assign("login.html"), error instanceof ApiError ? 500 : 1800);
  }
}

logoutButton.addEventListener("click", async () => {
  logoutButton.disabled = true;
  logoutButton.textContent = "Closing portal…";
  try {
    await ensureCsrfToken();
    await authApi.logout();
    window.location.assign("../index.html");
  } catch {
    logoutButton.disabled = false;
    logoutButton.textContent = "Log out";
    status.textContent = "Unable to log out right now. Please try again.";
  }
});

loadCurrentUser();

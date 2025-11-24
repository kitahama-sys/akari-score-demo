export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "App";

export const APP_LOGO = "/place-libre-logo.png";

// Generate login URL - redirect to /login for ID+Password authentication
export const getLoginUrl = () => {
  return "/login";
};

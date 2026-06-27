/**
 * Detects if the current device is a mobile device/phone.
 * Checks via User Agent (server-safe / client-safe) and screen width / touch support.
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === "undefined") return false;

  const isMobileScreen = window.innerWidth <= 768;
  const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const ua = navigator.userAgent || "";
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  return isMobileScreen && (hasTouch || isMobileUA);
};

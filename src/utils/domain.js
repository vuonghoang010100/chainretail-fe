export const HOSTNAME = import.meta.env.VITE_HOSTNAME;

export function getSubDomain() {
  if (onMainHost())
    return null;
  return window.location.hostname.split(".").at(0);
}

export function onMainHost() {
  return HOSTNAME === window.location.hostname;
}
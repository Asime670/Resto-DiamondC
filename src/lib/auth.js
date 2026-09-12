const ADMIN_SESSION_KEY = 'diamond_c_admin_session';

export const DEFAULT_ADMIN_USER = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin';
export const DEFAULT_ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'diamond2026';

export function checkAdminCredentials(username, password) {
  return username === DEFAULT_ADMIN_USER && password === DEFAULT_ADMIN_PASS;
}

export function setAdminSession(user) {
  if (typeof window === 'undefined') return;
  const sessionData = {
    username: user.username,
    role: 'administrator',
    loggedInAt: new Date().toISOString(),
  };
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
  document.cookie = `diamond_admin_auth=true; path=/; max-age=${60 * 60 * 24 * 7}`;
}

export function getAdminSession() {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(ADMIN_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function clearAdminSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_SESSION_KEY);
  document.cookie = 'diamond_admin_auth=; path=/; max-age=0';
}

export function isAdminAuthenticated() {
  if (typeof window === 'undefined') return false;
  return Boolean(getAdminSession());
}

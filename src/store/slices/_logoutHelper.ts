// Helper to clear cookies on logout (for non-HttpOnly cookies)
export function clearAuthCookies() {
  document.cookie = 'accessToken=; Max-Age=0; path=/;';
  document.cookie = 'user=; Max-Age=0; path=/;';
}

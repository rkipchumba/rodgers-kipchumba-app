const TOKEN_KEY = "jwt_token";

export const auth = {
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  },
  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },
};

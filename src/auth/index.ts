import { JWT_STORAGE_KEY } from "../config";

export const auth = {
  setToken: (token: string) => localStorage.setItem(JWT_STORAGE_KEY, token),
  getToken: (): string | null => localStorage.getItem(JWT_STORAGE_KEY),
  clearToken: () => localStorage.removeItem(JWT_STORAGE_KEY),
  isAuthenticated: (): boolean => !!localStorage.getItem(JWT_STORAGE_KEY),
};

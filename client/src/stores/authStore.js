import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('nxtbiz.user') || 'null'),
  accessToken: localStorage.getItem('nxtbiz.accessToken'),
  setSession: ({ user, accessToken }) => {
    localStorage.setItem('nxtbiz.user', JSON.stringify(user));
    localStorage.setItem('nxtbiz.accessToken', accessToken);
    set({ user, accessToken });
  },
  clearSession: () => {
    localStorage.removeItem('nxtbiz.user');
    localStorage.removeItem('nxtbiz.accessToken');
    set({ user: null, accessToken: null });
  }
}));

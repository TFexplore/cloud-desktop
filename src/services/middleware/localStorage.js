const STORAGE_KEY = 'cloud-desktop-layout';

export const localStorageMiddleware = {
  get() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },
  set(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
};
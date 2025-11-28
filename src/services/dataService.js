import { localStorageMiddleware } from './middleware/localStorage.js';

// Currently, we only use the localStorage middleware.
// In the future, we can easily switch to another middleware.
const middleware = localStorageMiddleware;

const defaultLayout = [
  { x: 0, y: 0, w: 2, h: 2, i: '0', static: false },
  { x: 2, y: 0, w: 2, h: 4, i: '1', static: true },
  { x: 4, y: 0, w: 2, h: 5, i: '2', static: false },
  { x: 6, y: 0, w: 2, h: 3, i: '3', static: false },
  { x: 8, y: 0, w: 2, h: 3, i: '4', static: false },
];

export const dataService = {
  loadLayout() {
    return middleware.get() || defaultLayout;
  },
  saveLayout(layout) {
    middleware.set(layout);
  },
};
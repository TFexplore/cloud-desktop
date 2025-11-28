import { localStorageMiddleware } from './middleware/localStorage.js';

// Currently, we only use the localStorage middleware.
// In the future, we can easily switch to another middleware.
const middleware = localStorageMiddleware;

const defaultLayout = [
  { x: 0, y: 0, w: 2, h: 2, i: '0', static: false, type: 'app', name: 'Google', link: 'https://www.google.com', icon: 'https://www.google.com/favicon.ico', openMode: 'newTab' },
  { x: 2, y: 0, w: 2, h: 4, i: '1', static: true, type: 'component', name: 'My Widget', html: '<div>Hello Widget!</div>', css: 'div { color: blue; }', js: 'console.log("Widget loaded");' },
  { x: 4, y: 0, w: 2, h: 5, i: '2', static: false, type: 'app', name: 'deepseek', link: 'https://www.deepseek.com/', icon: 'https://oss.nbtab.com/website/ai/deepseek.svg', openMode: 'window', windowWidth: 80, windowHeight: 70 },
  { x: 6, y: 0, w: 2, h: 3, i: '3', static: false, type: 'app', name: 'GitHub', link: 'https://github.com', icon: 'https://github.githubassets.com/favicon.ico', openMode: 'newTab' },
  { x: 8, y: 0, w: 2, h: 3, i: '4', static: false, type: 'component', name: 'Clock', html: '<div id="clock"></div>', css: '#clock { font-size: 20px; text-align: center; }', js: 'setInterval(() => { document.getElementById("clock").innerText = new Date().toLocaleTimeString(); }, 1000);' },
];

export const dataService = {
  loadLayout() {
    return middleware.get() || defaultLayout;
  },
  saveLayout(layout) {
    middleware.set(layout);
  },
};

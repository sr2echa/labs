class drawPath {
  private d: string = '';

  moveTo(x: number, y: number): this { return (this.d += `M${x} ${y} `, this); }
  lineTo(x: number, y: number): this { return (this.d += `L${x} ${y} `, this); }
  closePath(): this { return (this.d += 'Z ', this); }
  toString(): string { return this.d.trim(); }
  clear(): this { return (this.d = '', this); }  
}

const stats = document.querySelector<HTMLPreElement>('.stats');
const video = document.querySelector<HTMLVideoElement>('video');
const svg = document.querySelector<SVGElement>('svg');
const path = document.querySelector<SVGElement>('svg path');

type WindowDetails = {
  screenX: number;
  screenY: number;
  screenWidth: number;
  screenHeight: number;
  width: number;
  height: number;
  updated: number;
};

stats.style.display = 'none';

function toggleStatsVisibility() {
  if (stats) {
    stats.style.display = stats.style.display === 'none' ? 'block' : 'none';
  }
}

function setupKeybind() {
  document.addEventListener('keydown', (event) => {
    if (event.key === 's' || event.key === 'S') {
      toggleStatsVisibility();
    }
  });
}

function getScreens(): [string, WindowDetails][] {
  return Object.entries(window.localStorage)
    .filter(([key]) => key.startsWith('screen-'))
    .map(([key, value]: [string, string]) => [key, JSON.parse(value) as WindowDetails]);
}
function getScreenId() {
  const existingScreens = Object.keys(window.localStorage)
    .filter((key) => key.startsWith('screen-'))
    .map((key) => parseInt(key.replace('screen-', '')))
    .sort((a, b) => a - b);
  return existingScreens.at(-1) + 1 || 1;
}
const screenId = `screen-${getScreenId()}`;

function setScreenDetails() {
  const windowDetails = {
    screenX: window.screenX,
    screenY: window.screenY,
    screenWidth: window.screen.availWidth,
    screenHeight: window.screen.availHeight,
    width: window.outerWidth,
    height: window.innerHeight,
    updated: Date.now(),
  };
  window.localStorage.setItem(screenId, JSON.stringify(windowDetails));
  // console.log(windowDetails);
}

function displayStats() {
  if (!stats) return;
  const existingScreens = Object.fromEntries(getScreens());
  stats.innerHTML = JSON.stringify(existingScreens, null, ' ');
}

function removeOld() {
  const screens = getScreens();
  for (const [key, screen] of screens) {
    if (Date.now() - screen.updated > 1000) {
      localStorage.removeItem(key);
    }
  }
}

function drawSVG() {
  const screenPath = new drawPath();
  // Set the SVG viewBox using the screen size
  svg?.setAttribute('viewBox', `0 0 ${window.screen.availWidth} ${window.screen.availHeight}`);
  svg?.setAttribute('width', `${window.screen.availWidth}px`);
  svg?.setAttribute('height', `${window.screen.availHeight}px`);
  // OFfset it by the window position
  svg?.setAttribute('style', `transform: translate(-${window.screenX}px, -${window.screenY}px)`);
  // Also apply to video
  video?.setAttribute('style', `transform: translate(-${window.screenX}px, -${window.screenY}px)`);
  const screens = getScreens();
  screens
    .map(([key, screen]) => {
      if (typeof screen === 'string') return [key, screen];
      const x = screen.screenX + screen.width / 2;
      const y = screen.screenY + screen.height / 2;
      return [key, { ...screen, x, y }];
    })
    .forEach(([key, screen], i) => {
      if (typeof screen === 'string') return;
      if (i === 0) {
        screenPath.moveTo(screen.x, screen.y);
      } else {
        screenPath.lineTo(screen.x, screen.y);
      }
    });

  screenPath.closePath();
  path?.setAttribute('d', screenPath.toString());
}

const timers = [];

[setScreenDetails, displayStats, removeOld, drawSVG].forEach(func => {
  timers.push(setInterval(func, 10));
});

setupKeybind();

navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  if (!video) return;
  video.width = window.screen.availWidth;
  video.height = window.screen.availHeight;
  video.srcObject = stream;
  video.play();
});

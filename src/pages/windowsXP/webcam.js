class drawPath {
  constructor() {
    this.d = '';
  }

  moveTo(x, y) {
    this.d += `M${x} ${y} `;
    return this;
  }

  lineTo(x, y) {
    this.d += `L${x} ${y} `;
    return this;
  }

  closePath() {
    this.d += 'Z ';
    return this;
  }

  toString() {
    return this.d.trim();
  }

  clear() {
    this.d = '';
    return this;
  }
}

const stats = document.querySelector('.stats');
const video = document.querySelector('video');
const svg = document.querySelector('svg');
const path = document.querySelector('svg path');

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

function getScreens() {
  return Object.entries(window.localStorage)
    .filter(([key]) => key.startsWith('screen-'))
    .map(([key, value]) => [key, JSON.parse(value)]);
}

function getScreenId() {
  const existingScreens = Object.keys(window.localStorage)
    .filter((key) => key.startsWith('screen-'))
    .map((key) => parseInt(key.replace('screen-', ''), 10))
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
}

function displayStats() {
  if (!stats) return;
  const existingScreens = Object.fromEntries(getScreens());
  stats.innerHTML = JSON.stringify(existingScreens, null, ' ');
}

function removeOld() {
  const screens = getScreens();
  screens.forEach(([key, screen]) => {
    if (Date.now() - screen.updated > 1000) {
      localStorage.removeItem(key);
    }
  });
}

function drawSVG() {
  const screenPath = new drawPath();
  svg?.setAttribute('viewBox', `0 0 ${window.screen.availWidth} ${window.screen.availHeight}`);
  svg?.setAttribute('width', `${window.screen.availWidth}px`);
  svg?.setAttribute('height', `${window.screen.availHeight}px`);
  svg?.setAttribute('style', `transform: translate(-${window.screenX}px, -${window.screenY}px)`);
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

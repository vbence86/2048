// Resolution
export const DEFAULT_CANVAS_WIDTH = 720;
export const DEFAULT_CANVAS_HEIGHT = 1280;

// force portrait resolution
const width = Math.min(window.innerWidth, window.innerHeight);
const height = Math.max(window.innerWidth, window.innerHeight);

export const DEVICE_WIDTH = window.devicePixelRatio * width;
export const DEVICE_HEIGHT = window.devicePixelRatio * height;



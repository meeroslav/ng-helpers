import { DEVICE, Device, ORIENTATION, Orientation } from './model';

const SM = '(max-width: 768px)';
const MD = '(min-width: 769px) and (max-width: 1200px)';
const LG = '(min-width: 1201px) and (max-width: 1400px)';
const XL = '(min-width: 1401px)';

const LANDSCAPE = '(orientation: landscape)';
const PORTRAIT = '(orientation: portrait)';

export interface MediaBreakpoint {
  width: Device;
  orientation: Orientation;
}

export const MEDIA_BREAKPOINTS: Array<MediaBreakpoint & { mediaQuery: string }> = [
  { width: DEVICE.SM, orientation: ORIENTATION.LANDSCAPE, mediaQuery: `${SM} and ${LANDSCAPE}` },
  { width: DEVICE.MD, orientation: ORIENTATION.LANDSCAPE, mediaQuery: `${MD} and ${LANDSCAPE}` },
  { width: DEVICE.LG, orientation: ORIENTATION.LANDSCAPE, mediaQuery: `${LG} and ${LANDSCAPE}` },
  { width: DEVICE.XL, orientation: ORIENTATION.LANDSCAPE, mediaQuery: `${XL} and ${LANDSCAPE}` },
  { width: DEVICE.SM, orientation: ORIENTATION.PORTRAIT, mediaQuery: `${SM} and ${PORTRAIT}` },
  { width: DEVICE.MD, orientation: ORIENTATION.PORTRAIT, mediaQuery: `${MD} and ${PORTRAIT}` },
  { width: DEVICE.LG, orientation: ORIENTATION.PORTRAIT, mediaQuery: `${LG} and ${PORTRAIT}` },
  { width: DEVICE.XL, orientation: ORIENTATION.PORTRAIT, mediaQuery: `${XL} and ${PORTRAIT}` },
];

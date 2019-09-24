export const DEVICE: { [index: string]: Device } = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl'
};

export const ORIENTATION: { [index: string]: Orientation } = {
  LANDSCAPE: 'landscape',
  PORTRAIT: 'portrait'
};

export function isValidDevice(candidate: Device | any) {
  return Object.keys(DEVICE).map(_ => DEVICE[_]).includes(candidate);
}

export function isValidOrientation(candidate: Orientation | any) {
  return Object.keys(ORIENTATION).map(_ => ORIENTATION[_]).includes(candidate);
}

export type Device = 'sm' | 'md' | 'lg' | 'xl';

export type Orientation = 'landscape' | 'portrait';

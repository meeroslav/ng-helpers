import { OnDestroy } from '@angular/core';

export interface MediaQueryPayload {
  readonly matches: boolean;
  readonly media: string;
}

export abstract class BaseMedia implements OnDestroy {
  protected listenerCleanup: () => void;

  ngOnDestroy() {
    this.cleanup();
  }

  protected cleanup() {
    if (this.listenerCleanup) {
      this.listenerCleanup();
    }
  }

  protected attachListener(query: string, listener: (event: MediaQueryPayload) => void): void {
    const mediaQueryList = window.matchMedia(query);
    this.addListener(mediaQueryList, listener);
    this.listenerCleanup = () => this.removeListener(mediaQueryList, listener);
    // trigger initial
    listener(mediaQueryList);
  }

  protected addListener(mql: MediaQueryList, listener: (event: MediaQueryPayload) => void): void {
    mql.addEventListener
      ? mql.addEventListener('change', listener)
      // add deprecated listeners for fallback
      : mql.addListener(listener);
  }

  protected removeListener(mql: MediaQueryList, listener: (event: MediaQueryPayload) => void): void {
    mql.removeEventListener
      ? mql.removeEventListener('change', listener)
      // add deprecated remove listeners for fallback
      : mql.removeListener(listener);
  }
}

import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class MediaService implements OnDestroy {
  private matches = new ReplaySubject<boolean>(1);
  public match$ = this.matches.asObservable();

  private listenerCleanup: () => void;

  constructor(public readonly query: string) {
    if (!this.query) {
      throw new Error('Media query string must be provided');
    }
    if (window) {
      const mediaQueryList: MediaQueryList = window.matchMedia(this.query);
      const listener = event => this.matches.next(event.matches);
      this.addListener(mediaQueryList, listener);
      this.listenerCleanup = () => this.removeListener(mediaQueryList, listener);

      listener(mediaQueryList);
    } else {
      this.matches.complete();
    }
  }

  ngOnDestroy() {
    this.listenerCleanup && this.listenerCleanup();
  }

  private addListener(mql: MediaQueryList, listener: (event: MediaQueryListEvent) => void): void {
    mql.addEventListener
      ? mql.addEventListener('change', listener)
      // add deprecated listeners for fallback
      : mql.addListener(listener);
  }

  private removeListener(mql: MediaQueryList, listener: (event: MediaQueryListEvent) => void): void {
    mql.removeEventListener
      ? mql.removeEventListener('change', listener)
      // add deprecated remove listeners for fallback
      : mql.removeListener(listener);
  }
}

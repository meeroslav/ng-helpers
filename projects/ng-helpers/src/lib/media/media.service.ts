import { ReplaySubject } from 'rxjs';
import { MEDIA_BREAKPOINTS, MediaBreakpoint } from './media-breakpoints';
import { isValidDevice, isValidOrientation } from './model';
import { Injectable } from '@angular/core';

@Injectable()
export class MediaService {
  private mediaChanges$ = new ReplaySubject<MediaBreakpoint>(1);
  public mediaChanges = this.mediaChanges$.asObservable();

  constructor() {
    this.initListeners();
  }

  private initListeners() {
    if (window) {
      MEDIA_BREAKPOINTS.forEach(breakpoint => {
        const mediaQueryList = window.matchMedia(breakpoint.mediaQuery);
        const listener = (event: Partial<MediaQueryListEvent>) => {
          if (event.matches && isValidDevice(breakpoint.width) && isValidOrientation(breakpoint.orientation)) {
            const { mediaQuery, ...mediaBreakpoint } = breakpoint;
            this.mediaChanges$.next(mediaBreakpoint);
          }
        };
        mediaQueryList.addEventListener('change', listener);

        // fire first event
        listener({
          media: mediaQueryList.media,
          matches: mediaQueryList.matches
        });
      });
    }
  }
}

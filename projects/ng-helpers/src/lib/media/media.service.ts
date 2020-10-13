import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { BaseMedia, MediaQueryPayload } from './base-media.';

/**
 * Service for realtime media queries changing tracking
 *
 * @Usage
 *
 * const service = new MediaService('(min-width: 768px)'); // detect desktop
 * service.query; // => (min-width: 768px)
 * service.match$.subscribe(isDesktop => console.log(isDesktop));
 */
@Injectable()
export class MediaService extends BaseMedia {
  private matches = new ReplaySubject<boolean>(1);
  public match$ = this.matches.asObservable();

  constructor(public readonly query: string) {
    super();
    if (!this.query) {
      throw new Error('Media query string must be provided');
    }
    if (window) {
      const listener = (event: MediaQueryPayload) => this.matches.next(event.matches);
      this.attachListener(this.query, listener);
    } else {
      this.matches.complete();
    }
  }
}

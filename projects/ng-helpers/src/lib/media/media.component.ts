import { Component, Input } from '@angular/core';
import { BaseMedia, MediaQueryPayload } from './base-media.';

/**
 * Component for toggling content
 * based on matched media query
 *
 * @Usage
 *
 * <use-media [query]="'(min-width: 768px)'">I am only visible in desktop mode</use-media>
 * <use-media [query]="'(max-width: 767px)'">I am only visible on mobile mode</use-media>
 *
 */
@Component({
  selector: 'use-media',
  template: '<ng-content *ngIf="isMatch"></ng-content>'
})
export class MediaComponent extends BaseMedia {
  @Input() set query(value: string) {
    this.cleanup();
    this.initListener(value);
  }
  isMatch = false;

  private initListener(query: string): void {
    if (window) {
      this.attachListener(query, (event: MediaQueryPayload) => this.isMatch = event.matches);
    }
  }
}

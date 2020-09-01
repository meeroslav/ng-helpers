import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

/**
 * Structural directive for manipulating content of the template
 * based on matched media query
 *
 * @Usage
 *
 * <div *media="'(min-width: 768px)'">mobile</div>
 * <div *media="'(max-width: 767px)'">desktop</div>
 *
 */
@Directive({
  selector: '[media]'
})
export class MediaDirective {
  private listenerCleanup: () => void;
  private hasView = false;

  constructor(
    private readonly viewContainer: ViewContainerRef,
    private readonly template: TemplateRef<any>
  ) { }

  @Input() set media(value: string) {
    this.initListener(value);
  }

  private initListener(value: string): void {
    if (window) {
      if (this.listenerCleanup) {
        this.listenerCleanup();
      }

      const mediaQueryList = window.matchMedia(value);
      const listener = event => {
        if (event.matches && !this.hasView) {
          this.renderView();
        }
        if (!event.matches && this.hasView) {
          this.clearView();
        }
      };
      this.listenerCleanup = () => this.removeListener(mediaQueryList, listener);
      // trigger initial
      listener({
        media: mediaQueryList.media,
        matches: mediaQueryList.matches
      });
      this.addListener(mediaQueryList, listener);
    }
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

  private renderView(): void {
    this.hasView = true;
    this.viewContainer.createEmbeddedView(this.template);
  }

  private clearView(): void {
    this.hasView = false;
    this.viewContainer.clear();
  }
}

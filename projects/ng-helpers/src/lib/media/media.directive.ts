import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { BaseMedia, MediaQueryPayload } from './base-media.';

/**
 * Structural directive for manipulating content of the template
 * based on matched media query
 *
 * @Usage
 *
 * <div *media="'(min-width: 768px)'">desktop</div>
 * <div *media="'(max-width: 767px)'">mobile</div>
 *
 */
@Directive({
  selector: '[media]'
})
export class MediaDirective extends BaseMedia {
  private hasView = false;

  constructor(
    private readonly viewContainer: ViewContainerRef,
    private readonly template: TemplateRef<any>
  ) {
    super();
  }

  @Input() set media(query: string) {
    this.cleanup();
    this.initListener(query);
  }

  private initListener(query: string): void {
    if (window) {
      const listener = (event: MediaQueryPayload) => {
        if (event.matches && !this.hasView) {
          this.renderView();
        }
        if (!event.matches && this.hasView) {
          this.clearView();
        }
      };
      this.attachListener(query, listener);
    }
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

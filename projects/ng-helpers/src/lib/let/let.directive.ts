import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';

class NgLetContext<T> {
  $implicit: T = null;
  ngLet: T = null;
}

/**
 * Structural directive for extracting local template value
 * Similar to `*ngIf` with the significant difference that content gets
 * always rendered regardless of the value
 *
 * @Usage
 *
 * <div *ngIf="loadingState$ | async as loadingState">
 *  I will not be rendered if loadingState is falsy (0, false, null etc.)
 *   {{ loadingState }}
 * </div>
 * <div *ngLet="loadingState$ | async as loadingState">
 *   I get rendered no matter what
 *   {{ loadingState }}
 * </div>
 */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngLet]'
})
export class NgLetDirective<T = any> implements OnInit {
  private readonly context = new NgLetContext<T>();

  @Input()
  set ngLet(value: T) {
    this.context.$implicit = this.context.ngLet = value;
  }

  constructor(private readonly vcr: ViewContainerRef, private readonly templateRef: TemplateRef<NgLetContext<T>>) { }

  ngOnInit() {
    this.vcr.createEmbeddedView(this.templateRef, this.context);
  }
}

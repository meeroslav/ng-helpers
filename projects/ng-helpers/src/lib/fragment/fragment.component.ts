import { TemplateRef, ViewChild, ViewContainerRef, Directive } from '@angular/core';

// A component that replaces the host DOM element
// with contents of a ng-template in the target component
@Directive()
export abstract class FragmentComponent {
  @ViewChild(TemplateRef, { static: true }) template;

  constructor(private vcRef: ViewContainerRef) { }

  protected appendDOM() {
    this.vcRef.createEmbeddedView(this.template);
  }
}

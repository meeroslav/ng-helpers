import { TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';

// A component that replaces the host DOM element
// with contents of a ng-template in the target component
export abstract class FragmentComponent {
  @ViewChild(TemplateRef, { static: true }) template;

  constructor(private vcRef: ViewContainerRef) { }

  protected appendDOM() {
    this.vcRef.createEmbeddedView(this.template);
  }
}

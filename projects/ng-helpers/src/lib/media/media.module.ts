import { NgModule } from '@angular/core';
import { MediaDirective } from './media.directive';

@NgModule({
  declarations: [
    MediaDirective
  ],
  exports: [
    MediaDirective
  ]
})
export class MediaModule { }

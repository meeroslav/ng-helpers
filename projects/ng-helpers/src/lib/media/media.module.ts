import { NgModule } from '@angular/core';
import { MediaDirective } from './media.directive';
import { MediaService } from './media.service';

@NgModule({
  declarations: [
    MediaDirective
  ],
  providers: [
    MediaService
  ],
  exports: [
    MediaDirective
  ]
})
export class MediaModule { }

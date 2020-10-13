import { NgModule } from '@angular/core';
import { MediaComponent } from './media.component';
import { MediaDirective } from './media.directive';
import { MediaService } from './media.service';

@NgModule({
  declarations: [
    MediaDirective,
    MediaComponent
  ],
  providers: [
    MediaService
  ],
  exports: [
    MediaDirective
  ]
})
export class MediaModule { }

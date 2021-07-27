import { NgModule } from '@angular/core';
import { NgLetDirective } from './let.directive';

@NgModule({
  declarations: [
    NgLetDirective,
  ],
  exports: [
    NgLetDirective
  ],
})
export class LetModule { }

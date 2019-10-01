/*
 * Public API Surface of ng-helpers
 */
// FRAGMENT COMPONENT
export { FragmentComponent } from './lib/fragment/fragment.component';

// MEDIA SERVICE
export { MediaModule } from './lib/media/media.module';
export { MediaService } from './lib/media/media.service';
export { MediaBreakpoint, MEDIA_BREAKPOINTS } from './lib/media/media-breakpoints';
export { Device, Orientation, DEVICE, ORIENTATION } from './lib/media/model';

// NGRX HELPERS
export { BaseAction, BaseFailedAction, BaseLoadAction, ActionClass } from './lib/ngrx/base.actions';
export { baseReducer, ReducerHandler, ReducerHandlers } from './lib/ngrx/base.reducer';
export { BaseEffects } from './lib/ngrx/base.effects';
export { BaseState, baseInitialState } from './lib/ngrx/base-state';
export { ofAction } from './lib/ngrx/ofAction';

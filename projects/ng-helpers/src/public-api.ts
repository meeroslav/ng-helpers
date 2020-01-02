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
export {
  BaseAction, BaseFailedAction, BaseLoadAction, BaseSuccessAction, ActionClass, FailedActionClass
}from './lib/ngrx/base.actions';
export { baseReducer } from './lib/ngrx/base.reducer';
export { BaseEffects } from './lib/ngrx/base.effects';
export { ofAction } from './lib/ngrx/ofAction';
export {
  GroupedAction, ActionGroup, BaseState, baseInitialState, GroupedReducers, FailurePayload
}from './lib/ngrx/model';
export { createLoadAction, createSuccessAction, createFailureAction } from './lib/ngrx/grouped-action';
export { createGroupedReducer } from './lib/ngrx/grouped-reducer';
export { EffectsHelper } from './lib/ngrx/effects-helper';

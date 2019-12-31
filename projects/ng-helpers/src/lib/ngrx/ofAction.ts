import { Action } from '@ngrx/store';
import { OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ActionClass } from './base.actions';

/**
 * @description
 * 'ofAction' filters an Observable of class based Actions into an observable of Actions
 * whose constructor function (therefore base class) matches the given list of
 * whitelisted Action classes.
 *
 * If actions observable is an observable containing stream of actions of type LoadProducts, ProductsLoaded and
 * ProductLoadFailed - Observable<LoadProducts|ProductsLoaded|ProductLoadFailed> and we set filter as
 * `actions.pipe(ofAction(LoadProducts))` then the result will be Observable<LoadProducts>. Actions not matching the
 * filter will be filtered out
 *
 * @param allowedActions Array of Action classes
 *
 */
export function ofAction(...allowedActions: ActionClass[]): OperatorFunction<Action, Action> {
  return filter((action: Action) => allowedActions.some(allowedAction => action.constructor === allowedAction));
}

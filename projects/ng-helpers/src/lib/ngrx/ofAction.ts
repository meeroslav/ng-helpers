import { Action } from '@ngrx/store';
import { OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ActionClass } from './base.actions';

export function ofAction(...allowedActions: Array<ActionClass<any>>): OperatorFunction<Action, Action> {
  return filter((action: Action) => allowedActions.some(allowedAction => action.constructor === allowedAction));
}

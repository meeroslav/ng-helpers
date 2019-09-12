import { ActionClass, BaseAction, BaseFailedAction } from './base.actions';
import { ofAction } from './ofAction';
import { Actions } from '@ngrx/effects';
import { of, OperatorFunction } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';

type FailedActionClass<T extends BaseFailedAction> = ActionClass<T>;

export abstract class BaseEffects<S> {
  protected constructor(protected readonly actions$: Actions, protected readonly service: S) { }

  // map action to switchMap service action call with pipe processing and action in case of failure
  protected switchMapEffect<T extends BaseAction<any>>(actionClass: ActionClass<T>,
                                                       method: keyof S,
                                                       failActionClass: FailedActionClass,
                                                       switchPipe: (action: T) => OperatorFunction<any, any>) {
    return this.actions$.pipe(
      ofAction(actionClass),
      switchMap((action: T) => (this.service[method] as any)(action.payload)
        .pipe(
          switchPipe(action),
          catchError(error => of(new failActionClass(action.payload, error)))
        ))
    );
  }

  // map action to concatMap service action call with pipe processing and action in case of failure
  protected concatMapEffect<T extends BaseAction<any>>(actionClass: ActionClass<T>,
                                                       method: keyof S,
                                                       failActionClass: FailedActionClass,
                                                       concatPipe: (action: T) => OperatorFunction<any, any>) {
    return this.actions$.pipe(
      ofAction(actionClass),
      concatMap((action: T) => (this.service[method] as any)(action.payload)
        .pipe(
          concatPipe(action),
          catchError(error => of(new failActionClass(action.payload, error)))
        ))
    );
  }

  // map action to service method call
  protected mapMethodEffect<T extends BaseAction<any>>(actionClass: ActionClass<T>,
                                                       method: keyof S) {
    return this.actions$.pipe(
      ofAction(actionClass),
      map((action: T) => (this.service[method] as any)(action.payload))
    );
  }

  // map action to target action with payload callback action handler as parameter
  protected mapActionEffect<T extends BaseAction<any>>(actionClass: ActionClass<T>,
                                                       targetAction: ActionClass<any>,
                                                       payloadCallback: (action: T) => any) {
    return this.actions$.pipe(
      ofAction(actionClass),
      map((action: T) => new targetAction(payloadCallback(action)))
    );
  }

  protected mapServiceActionEffect<T extends BaseAction<any>>(actionClass: ActionClass<T>,
                                                              targetAction: ActionClass<any>,
                                                              method: keyof S) {
    return this.mapActionEffect(actionClass, targetAction, this.service[method] as any);
  }
}

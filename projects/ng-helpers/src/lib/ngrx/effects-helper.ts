import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, ActionCreator, Creator } from '@ngrx/store';
import { Observable, of, OperatorFunction, pipe } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';

/**
 * @description
 * Abstract effect helper class that reduces boilerplate
 * by extracting common functionality into helper effect creators
 */
export abstract class EffectsHelper {
  /**
   * @param actions$ Observable of actions dispatched on store
   */
  protected constructor(protected readonly actions$: Actions<Action>) { }

  /**
   *
   * @description
   * Create side effect by mapping action to a function call using `switchMap` to handle concurrency.
   *
   * @param method Function to call with action payload
   * @param innerPipe Pipe to handle successful response and/or source
   * @param failureTarget Action to dispatch on failure
   * @param allowedTypes Actions (or types) to filter by
   */
  protected createSwitchMapEffect<REQ extends object = {}, RES = any>(
    method: (payload: REQ) => Observable<RES>,
    innerPipe: (action: REQ) => OperatorFunction<RES, Action>,
    failureTarget: ActionCreator<string, Creator>,
    ...allowedTypes: Array<string | ActionCreator<string, Creator>>
  ) {
    return createEffect(() => this.actions$.pipe(
      ofType(...allowedTypes),
      switchMap((action: REQ & Action) => method(action)
        .pipe(
          this.mapInnerPipe<REQ & Action, RES>(innerPipe, failureTarget, action)
        ) as Observable<Action> // TODO: remove `as Observable<Action>` after PR
      )
    ));
  }

  /**
   *
   * @description
   * Create side effect by mapping action to a function call using `switchMap` to handle concurrency.
   *
   * @param method Function to call with action payload
   * @param innerPipe Pipe to handle successful response and/or source
   * @param failureTarget Action to dispatch on failure
   * @param allowedTypes Actions (or types) to filter by
   */
  protected createConcatMapEffect<REQ extends object = {}, RES = any>(
    method: (action: REQ) => Observable<RES>,
    innerPipe: (action: REQ) => OperatorFunction<RES, Action>,
    failureTarget: ActionCreator<string, Creator>,
    ...allowedTypes: Array<string | ActionCreator<string, Creator>>
  ) {
    return createEffect(() => this.actions$.pipe(
      ofType(...allowedTypes),
      concatMap((action: REQ & Action) => method(action)
        .pipe(
          this.mapInnerPipe<REQ & Action, RES>(innerPipe, failureTarget, action)
        ) as Observable<Action> // TODO: remove `as Observable<Action>` after PR
      )
    ));
  }

  /**
   * switchMap/concatMap pipe logic
   * If response is successful call `innerPipe` with original payload, otherwise pass payload and error to `failureTarget`
   *
   * @param innerPipe Pipe to handle response and/or source
   * @param failureTarget Action to dispatch on failure
   * @param action Source action
   */
  private mapInnerPipe<REQ extends Action, RES = any>(
    innerPipe: (action: REQ) => OperatorFunction<RES, Action>,
    failureTarget: ActionCreator<string, Creator>,
    action: REQ
  ): OperatorFunction<RES, Action> {
    const { type, actionGroup, ...payload } = action as any;
    return pipe.call(this,
      innerPipe(action),
      catchError(error => of(failureTarget({ ...payload, error })))
    );
  }

  /**
   * @description
   * Filter specific Action and map it to `targetAction` with using `mapper` to modify payload
   *
   * @param target Action to map to
   * @param mapper Mapper function to apply to source payload
   * @param allowedTypes Actions (or types) to filter by
   *
   * @usageNotes
   * ```ts
   * failureEfx$ = this.createActionEffect(
   *   ShowFailureMessage,
   *   ({ productId }) => `Loading product ${productId} failed`,
   *   LoadProductFailed);
   * ```
   *
   * which is equivalent to
   * ```ts
   * failureEfx$ = createEffect(() => this.actions$.pipe(
   *   ofAction(LoadProductFailed),
   *   map(({ productId }) => new ShowFailureMessage(`Loading product ${productId} failed`))
   * ));
   * ```
   */
  protected createActionEffect<T>(
    target: ActionCreator<string, Creator>,
    mapper: (action: T & Action) => T,
    ...allowedTypes: Array<string | ActionCreator<string, Creator>>
  ) {
    return createEffect(() => this.actions$.pipe(
      ofType(...allowedTypes),
      map((action: T & Action) => mapper ? mapper(action) : action),
      map((payload: T) => target(payload) as Action) // TODO: remove `as Action` after PR
    ));
  }
}

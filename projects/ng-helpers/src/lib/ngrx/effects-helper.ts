import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, ActionCreator, Creator } from '@ngrx/store';
import { Observable, of, OperatorFunction, pipe } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';

type TypeOrCreator = string | ActionCreator<string, Creator>;

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
   * @param allowedTypes Action, type or array of actions or types to filter by
   * @param method Function to call with action payload, returns Observable
   * @param innerPipe Pipe to handle successful response and/or source
   * @param failureTarget Action to dispatch on failure
   *
   * @usageNotes
   * ```ts
   * efx1$ = this.createSwitchMapEffect(
   *   loadProducts,
   *   this.service.getProducts,
   *   () => map(response => productsLoaded(response)),
   *   productsLoadFailed
   * );
   * efx2$ = this.createSwitchMapEffect(
   *   [loadProduct, loadSelectedProduct]
   *   this.service.getProduct,
   *   () => map(response => productLoaded(response)),
   *   productLoadFailed
   * );
   * ```
   *
   * which is equivalent to:
   * ```ts
   * efx1$ = createEffect(() => this.actions$.pipe(
   *   ofType(loadProducts),
   *   switchMap(action => this.service.getProducts(action)
   *     .pipe(
   *       map(response => productsLoaded(response)),
   *       catchError(error => productsLoadFailed({ ...action, error })
   *      )
   *    )
   * ));
   * efx2$ = createEffect(() => this.actions$.pipe(
   *   ofType(loadProduct, loadSelectedProduct),
   *   switchMap(action => this.service.getProduct(action)
   *     .pipe(
   *       map(response => productLoaded(response)),
   *       catchError(error => productLoadFailed({ ...action, error })
   *      )
   *    )
   * ));
   * ```
   */
  protected createSwitchMapEffect<REQ extends object = {}, RES = any>(
    allowedTypes: TypeOrCreator | [TypeOrCreator, ...Array<TypeOrCreator>],
    method: (action: REQ) => Observable<RES>,
    innerPipe: (action: REQ) => OperatorFunction<RES, Action>,
    failureTarget: ActionCreator<string, Creator>
  ) {
    return createEffect(() => this.actions$.pipe(
      ofType(...Array.isArray(allowedTypes) ? allowedTypes : [allowedTypes]),
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
   * @param allowedTypes Action, type or array of actions or types to filter by
   * @param method Function to call with action payload, returns Observable
   * @param innerPipe Pipe to handle successful response and/or source
   * @param failureTarget Action to dispatch on failure
   *
   * @usageNotes
   * ```ts
   * efx1$ = this.createConcatMapEffect(
   *   saveProducts,
   *   this.service.saveProducts,
   *   () => map(response => productsSaved(response)),
   *   productsSaveFailed
   * );
   * efx2$ = this.createConcatMapEffect(
   *   [deleteProduct, deleteSelectedProduct]
   *   this.service.deleteProduct,
   *   () => map(response => productDeleted(response)),
   *   productDeleteFailed
   * );
   * ```
   *
   * which is equivalent to:
   * ```ts
   * efx1$ = createEffect(() => this.actions$.pipe(
   *   ofType(saveProducts),
   *   concatMap(action => this.service.saveProducts(action)
   *     .pipe(
   *       map(response => productsSaved(response)),
   *       catchError(error => productsSaveFailed({ ...action, error })
   *      )
   *    )
   * ));
   * efx2$ = createEffect(() => this.actions$.pipe(
   *   ofType(deleteProduct, deleteSelectedProduct),
   *   concatMap(action => this.service.deleteProduct(action)
   *     .pipe(
   *       map(response => productDeleted(response)),
   *       catchError(error => productDeleteFailed({ ...action, error })
   *      )
   *    )
   * ));
   * ```
   */
  protected createConcatMapEffect<REQ extends object = {}, RES = any>(
    allowedTypes: TypeOrCreator | [TypeOrCreator, ...Array<TypeOrCreator>],
    method: (action: REQ) => Observable<RES>,
    innerPipe: (action: REQ) => OperatorFunction<RES, Action>,
    failureTarget: ActionCreator<string, Creator>
  ) {
    return createEffect(() => this.actions$.pipe(
      ofType(...Array.isArray(allowedTypes) ? allowedTypes : [allowedTypes]),
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
   * @param allowedTypes Action, type or array of actions or types to filter by
   * @param mapper Mapper function to generate new action from source action's payload
   *
   * @usageNotes
   * ```ts
   * failureEfx$ = this.createMapEffect(
   *   loadProductFailed,
   *   ({ productId }) => showFailureMessage({ message: `Loading product ${productId} failed` })
   * );
   * ```
   *
   * which is equivalent to
   * ```ts
   * failureEfx$ = createEffect(() => this.actions$.pipe(
   *   ofType(loadProductFailed),
   *   map(({ productId }) => showFailureMessage({ message: `Loading product ${productId} failed` }))
   * ));
   * ```
   */
  protected createMapEffect<T>(
    allowedTypes: TypeOrCreator | [TypeOrCreator, ...Array<TypeOrCreator>],
    mapper: (action: T & Action) => Action,
  ) {
    return createEffect(() => this.actions$.pipe(
      ofType(...Array.isArray(allowedTypes) ? allowedTypes : [allowedTypes]),
      map((action: T & Action) => mapper(action)) // TODO: remove `as Action` after PR
    ));
  }
}

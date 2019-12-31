import { Actions, createEffect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, OperatorFunction, pipe } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { ActionClass, BaseAction, FailedActionClass } from './base.actions';
import { ofAction } from './ofAction';

/**
 * @description
 * Abstract effect helper class that reduces boilerplate
 * by extracting common functionality info helper effect creators
 */
export abstract class BaseEffects<S> {
  protected constructor(protected readonly actions$: Actions, protected readonly service: S) {
  }

  /**
   * @description
   * Create side effect by mapping action to service method call using `switchMap` to handle concurrency.
   *
   * @param actionClass ActionClass to filter by
   * @param method Service method to call with action payload
   * @param failureTarget Action to dispatch on failure
   * @param innerPipe Pipe to handle successful response and/or source
   *
   * @usageNotes
   * ```ts
   * loadEfx$ = this.createSwitchMapEffect(LoadProduct, this.service.loadProduct, ProductLoadFailed,
   *   () => pipe(map(product => new ProductLoaded(product));
   * ```
   *
   * is equivalent to:
   * ```ts
   * loadEfx$ = createEffect(() => this.actions$.pipe(
   *   ofAction(LoadProduct),
   *   switchMap((action: LoadProduct) => this.service.loadProduct(action.payload)
   *     .pipe(
   *       map(product => new ProductLoaded(product),
   *       catchError(error => of(new ProductLoadFailed(action.payload, error))
   *     ))
   * ));
   * ```
   */
  protected createSwitchMapEffect<A extends BaseAction, RES>(
    actionClass: ActionClass<A>,
    method: (action: A) => RES,
    failureTarget: FailedActionClass,
    innerPipe: (action: A) => OperatorFunction<any, any>
  ): Observable<Action> {
    return createEffect(() => this.actions$.pipe(
      ofAction(actionClass),
      switchMap((action: A) => method.bind(this.service)(action.payload)
        .pipe(this.mapInnerPipe<A, RES>(action, innerPipe, failureTarget)))
    ));
  }

  /**
   * @description
   * Create side effect by mapping action to service method call using `concatMap` to handle concurrency.
   *
   * @param actionClass ActionClass to filter by
   * @param method Service method to call with action payload
   * @param failureTarget Action to dispatch on failure
   * @param innerPipe Pipe to handle successful response and/or source
   *
   * @usageNotes
   * ```ts
   * deleteEfx$ = this.createConcatMapEffect(DeleteProduct, this.service.deleteProduct, DeleteProductFailed,
   *   () => pipe(map(response => new ProductDeleted(response));
   * ```
   *
   * is equivalent to:
   * ```ts
   * deleteEfx$ = createEffect(() => this.actions$.pipe(
   *   ofAction(DeleteProduct),
   *   concatMap((action: DeleteProduct) => this.service.deleteProduct(action.payload)
   *     .pipe(
   *       map(response => new ProductDeleted(response),
   *       catchError(error => of(new DeleteProductFailed(action.payload, error))
   *     ))
   * ));
   * ```
   */
  protected createConcatMapEffect<A extends BaseAction, RES>(
    actionClass: ActionClass<A>,
    method: (action: A) => RES,
    failureTarget: FailedActionClass,
    innerPipe: (action: A) => OperatorFunction<any, any>
  ): Observable<Action> {
    return createEffect(() => this.actions$.pipe(
      ofAction(actionClass),
      concatMap((action: A) => method.bind(this.service)(action.payload)
        .pipe(this.mapInnerPipe<A, RES>(action, innerPipe, failureTarget)))
    ));
  }

  /**
   * switchMap/concatMap pipe logic
   * If response is successful call `innerPipe`, otherwise pass error to `failureTarget`
   *
   * @param action Original source action
   * @param innerPipe Pipe to handle response and/or source
   * @param failureTarget Action to dispatch on failure
   */
  private mapInnerPipe<A extends BaseAction, RES>(
    action: A,
    innerPipe: (action: A) => OperatorFunction<any, any>,
    failureTarget: FailedActionClass
  ) {
    return pipe.call(this,
      innerPipe(action),
      catchError(error => of(new failureTarget(action.payload, error)))
    );
  }

  /**
   * @description
   * Filter specific Action and map it to `targetAction` with using `mapper` to modify payload
   *
   * @param actionClass ActionClass to filter by
   * @param targetAction Action to map to
   * @param mapper Mapper function to apply to source payload
   *
   * @usageNotes
   * ```ts
   * failureEfx$ = this.mapActionEffect(LoadProductFailed, ShowFailureMessage,
   *   (action: LoadProductFailed) => `Loading product ${action.payload} failed`);
   * ```
   *
   * which is equivalent to
   * ```ts
   * failureEfx$ = createEffect(() => this.actions$.pipe(
   *   ofAction(LoadProductFailed),
   *   map((action: LoadProductFailed) => action.payload),
   *   map((productId: string) => new ShowFailureMessage(`Loading product ${productId} failed`))
   * ));
   * ```
   */
  protected mapActionEffect<A extends BaseAction>(
    actionClass: ActionClass<A>,
    targetAction: ActionClass,
    mapper: (action: A) => any = action => action
  ): Observable<Action> {
    return createEffect(() => this.actions$.pipe(
      ofAction(actionClass),
      map((action: A) => new targetAction(mapper(action)))
    ));
  }
}

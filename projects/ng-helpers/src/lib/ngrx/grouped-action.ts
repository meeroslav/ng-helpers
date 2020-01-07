import { ActionCreator, Creator } from '@ngrx/store';
import { FunctionWithParametersType, TypedAction } from '@ngrx/store/src/models';
import { ActionGroup, FailurePayload, GroupedAction } from './model';

// Abstract generic action for groped action factories
// @param actionGroup Group of the action creator factory
function groupedActionFactory<O extends object>(actionGroup: ActionGroup) {
  function createGroupedAction<T extends string>(
    type: T
  ): ActionCreator<T, () => GroupedAction & TypedAction<T>> & GroupedAction;
  function createGroupedAction<T extends string, P extends O>(
    type: T,
    config: { _as: 'props'; _p: P }
  ): ActionCreator<T, (props: P) => P & GroupedAction & TypedAction<T>> & GroupedAction;
  function createGroupedAction<
    T extends string,
    P extends any[],
    R extends O
    >(
    type: T,
    creator: Creator<P, R>
  ): FunctionWithParametersType<P, R & GroupedAction & TypedAction<T>> & GroupedAction & TypedAction<T>;
  function createGroupedAction<T extends string, C extends Creator>(
    type: T,
    config?: { _as: 'props' } | C
  ): ActionCreator<T> & GroupedAction {
    if (typeof config === 'function') {
      return defineGroupedType<T>(type, actionGroup, (...args: any[]) => ({
        ...config(...args),
        type,
        actionGroup
      }));
    }
    const as = config ? config._as : 'empty';
    switch (as) {
      case 'empty':
        return defineGroupedType<T>(type, actionGroup, () => ({ type, actionGroup }));
      case 'props':
        return defineGroupedType<T>(type, actionGroup, (payload: O) => ({
          ...payload,
          type,
          actionGroup
        }));
      default:
        throw new Error('Unexpected config.');
    }
  }
  return createGroupedAction;
}

// Extension on ngrx defineType function providing extra parameter for presetting actionGroup
function defineGroupedType<T extends string = string>(type: T, actionGroup: ActionGroup, creator: Creator)
  : ActionCreator<T> & GroupedAction {
  return Object.defineProperties(creator, {
    type: {
      value: type,
      writable: false
    },
    actionGroup: {
      value: actionGroup,
      writable: false
    }
  });
}
/**
 * @description
 * Action creator factory for LOAD actions extending action object with `actionGroup: ActionGroup.LOAD`.
 * These actions are meant to request (load) data from external APIs or other resources.
 *
 * For details on usage see `ngrx` original `createAction`
 *
 * @usageNotes
 *
 * ```ts
 * const loadProduct = createLoadAction('[Product] Load Product', props<{ id: string }>());
 * const loadProductAction = loadProduct({ id: '12345' });
 * ```
 *
 * which is equivalent to:
 * ```ts
 * const loadProduct = createAction('[Product] Load Product', props<{ id: string, actionGroup: ActionGroup }>());
 * const loadProductAction = loadProduct({ id: '12345', actionGroup: ActionGroup.LOAD });
 * ```
 */
export const createLoadAction = groupedActionFactory(ActionGroup.LOAD);
/**
 * @description
 * Action creator factory for SUCCESS actions extending action object with `actionGroup: ActionGroup.SUCCESS`
 * These actions are meant to store (document) data from external APIs or other resources in the state.
 *
 * For details on usage see `ngrx` original `createAction`
 *
 * @usageNotes
 *
 * ```ts
 * const productLoaded = createSuccessAction('[Product] Product Loaded', props<Product>());
 * const productLoadedAction = productLoaded(response);
 * ```
 *
 * which is equivalent to:
 * ```ts
 * const productLoaded = createAction('[Product] Product Loaded', props<Product & { actionGroup: ActionGroup }>());
 * const productLoadedAction = productLoaded({ ...response, actionGroup: ActionGroup.LOAD });
 * ```
 */
export const createSuccessAction = groupedActionFactory(ActionGroup.SUCCESS);
/**
 * @description
 * Action creator factory for FAILURE actions extending action object with `actionGroup: ActionGroup.FAILURE`
 * These actions are meant to store (document) error from external APIs or other resources in the state.
 *
 * For details on usage see `ngrx` original `createAction`
 *
 * @usageNotes
 *
 * ```ts
 * const productLoadFailed = createFailureAction('[Product] Load Product Failed', props<{ id: string }>());
 * const productFailedAction = productLoadFailed({ id: '12345', error: responseError });
 * ```
 *
 * which is equivalent to:
 * ```ts
 * const productLoadFailed = createAction('[Product] Load Product Failed', props<{ id: string, actionGroup: ActionGroup, error: Error }>());
 * const productFailedAction = productLoadFailed({ id: '12345', error: responseError , actionGroup: ActionGroup.LOAD });
 * ```
 */
export const createFailureAction = groupedActionFactory<FailurePayload>(ActionGroup.FAILURE);

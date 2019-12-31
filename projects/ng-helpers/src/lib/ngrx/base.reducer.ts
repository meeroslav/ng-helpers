import { Action } from '@ngrx/store';
import { ActionClass, BaseAction, BaseFailedAction } from './base.actions';
import { ActionGroup, BaseState, ReducerHandlers } from './model';

/**
 * @description
 * Generic reducer function that automatically handles generic base actions
 * if not specified otherwise
 *
 * All `loading` actions would result with error reset:
 * ```ts
 * { ...state, error: null }
 * ```
 * while all `failure` actions would set the error:
 * { ...state, error: action.error }
 *
 * Actions of type `success` leave the state unchanged if not specified otherwise
 *
 * @param state Type of state
 * @param actions Array of parent action constructors we want to use reducer with
 * @param action Current action in the pipeline
 * @param config Generic handlers for specific group of actions. See [[ReducerHandler]] for more details
 *
 * @usageNotes
 *
 * In `actions` file:
 * ```ts
 * export class LoadProducts extends BaseLoadAction<string> { }
 * export class ProductsLoaded extends BaseSuccessAction<Product[]> { }
 * ...
 * export type ProductActions = LoadProducts | ProductsLoaded | ...;
 * ```
 * Reducer file:
 * ```ts
 * import * as actions from './actions';
 *
 * export function productReducer(state: ProductState = initialState, action: actions.ProductActions): ProductState {
 *   return baseReducer(state, Object.values(actions), action, { successReducer })
 * }
 *
 * function successReducer(state: ProductState, action: actions.ProductActions): ProductState {
 *    switch (action.constructor) {
 *      case actions.ProductsLoaded: {
 *        return { ...state, products: action.payload };
 *      }
 *      default:
 *        return state;
 *    }
 * }
 * ```
 *
 * Which is equivalent to:
 * ```ts
 * import * as actions from './actions';
 *
 * function successReducer(state: ProductState = initialState, action: actions.ProductActions): ProductState {
 *    switch (action.constructor) {
 *      case actions.LoadProducts:
 *      case actions.LoadProduct:
 *      ... {
 *        return { ...state, error: null };
 *      }
 *      case actions.ProductsLoaded: {
 *        return { ...state, products: action.payload };
 *      }
 *      case actions.ProductsLoadFailed:
 *      case actions.ProductLoadFailed:
 *      ... {
 *        return { ...state, error: action.error };
 *      }
 *      default:
 *        return state;
 *    }
 * }
 * ```
 */
export function baseReducer<T extends BaseState>(state: T,
                                                 actions: ActionClass[],
                                                 action: BaseAction<any>,
                                                 config?: ReducerHandlers<T, Action>): T {
  // bail out if action does not match expected class
  if (actions.indexOf(action.constructor as ActionClass) === -1) {
    return state;
  }
  if (action.actionGroup === ActionGroup.LOAD) {
    return config && config.loadReducer
      ? config.loadReducer(state, action)
      : defaultLoadReducer(state);
  }
  if (action.actionGroup === ActionGroup.SUCCESS) {
    return config && config.successReducer
      ? config.successReducer(state, action)
      : defaultSuccessReducer(state);
  }
  if (action.actionGroup === ActionGroup.FAILURE) {
    return config && config.failureReducer
      ? config.failureReducer(state, action as BaseFailedAction<any>)
      : defaultFailedReducer(state, action as BaseFailedAction<any>);
  }
  return state;
}

// default reducer function to run on every load action
const defaultLoadReducer = <S extends BaseState>(state: S): S => ({ ...state, error: null });
// default reducer function to run on every success action
const defaultSuccessReducer = <S extends BaseState>(state: S): S => ({ ...state });
// default reducer function to run on every failed action
const defaultFailedReducer = <S extends BaseState>(state: S, action: BaseFailedAction<any>): S => ({ ...state, error: action.error });


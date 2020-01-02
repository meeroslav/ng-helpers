import { Action, ActionCreator, ActionReducer, Creator } from '@ngrx/store';
import { ActionGroup, BaseState, FailurePayload, GroupedAction, GroupedReducers, LoadingState } from './model';

/**
 * @description
 * Create generic reducer that automatically processes actions based on their group type
 *
 * @param initialState Initial/default value of the state
 * @param creators Allowed actions that should be processed by the reducer
 * @param config Configuration of reducer overrides for specific group of actions. See [[GroupedReducers]]
 *
 * @usageNotes
 *
 * In `actions` file:
 * ```ts
 * export const loadProducts = createLoadAction('[Product] Load Products');
 * export const productsLoaded = createSuccessAction('[Product] Products Loaded', props<{ products: Product[] }>());
 * ...
 * ```
 * Reducer file:
 * ```ts
 * import * as actions from './actions';
 *
 * const successReducer = createReducer(
 *   initialState,
 *   on(productLoaded, (state, { product }) => ({ ...state, product, loading: LoadingState.SUCCESSFUL })),
 *   on(productsLoaded, (state, { products }) => ({ ...state, products, loading: LoadingState.SUCCESSFUL }))
 * );
 * export const productReducer = createGroupedReducer(initialState, actions, { successReducer });
 * ```
 *
 * Which is equivalent to:
 * ```ts
 * import * as actions from './actions';
 *
 * export const productReducer = createReducer(
 *   initialState,
 *   on(LoadProducts, LoadProduct, ...,
 *     (state) => ({ ...state, error: null, loading: LoadingState.LOADING })),
 *   on(productLoaded, (state, { product }) => ({ ...state, product, loading: LoadingState.SUCCESSFUL })),
 *   on(productsLoaded, (state, { products }) => ({ ...state, products, loading: LoadingState.SUCCESSFUL }))
 *   on(LoadProductsFailed, LoadProductFailed, ...,
 *     (state, { error }) => ({ ...state, error, loading: LoadingState.FAILED })),
 * );
 * ```
 */
export function createGroupedReducer<S extends BaseState, A extends GroupedAction & Action>(
  initialState: S,
  creators: { [key: string]: ActionCreator<string, Creator> },
  config?: GroupedReducers<S, A>
): ActionReducer<S, A> {

  return (state: S = initialState, action: A): S => {
    if (!creators[action.type]) {
      return state;
    }
    if (action.actionGroup === ActionGroup.LOAD) {
      return config.loadReducer ? config.loadReducer(state, action) : defaultLoadReducer(state);
    }
    if (action.actionGroup === ActionGroup.SUCCESS) {
      return config.successReducer ? config.successReducer(state, action) : defaultSuccessReducer(state);
    }
    if (action.actionGroup === ActionGroup.FAILURE) {
      return config.failureReducer ? config.failureReducer(state, action) : defaultFailedReducer(state, action);
    }
    throw new Error('Unexpected action.');
  };
}

/**
 * Default reducer for handling all the load actions
 * Sets loading to `LoadingState.LOADING` and resets error
 *
 * @param state Store state of `BaseState` type
 */
function defaultLoadReducer<S extends BaseState>(state: S): S {
  return { ...state, loading: LoadingState.LOADING, error: null };
}
/**
 * Default reducer for handling all the success actions
 * Sets loading to `LoadingState.SUCCESSFUL`
 *
 * @param state Store state of `BaseState` type
 */
function defaultSuccessReducer<S extends BaseState>(state: S): S {
  return { ...state, loading: LoadingState.SUCCESSFUL };
}
/**
 * Default reducer for handling all the failure actions
 * Sets loading to `LoadingState.FAILED` and sets error
 *
 * @param state Store state of `BaseState` type
 * @param action Action to apply to reducer. Must extend `FailurePayload`
 */
function defaultFailedReducer<S extends BaseState, A extends FailurePayload>(state: S, action: A): S {
  return { ...state, loading: LoadingState.FAILED, error: action.error };
}

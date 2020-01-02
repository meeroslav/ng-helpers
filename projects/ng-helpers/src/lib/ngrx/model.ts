/**
 * @description
 * Enum of possible action groups
 */
import { Action, ActionReducer } from '@ngrx/store';

export enum ActionGroup {
  LOAD = 'LOAD',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE'
}

/**
 * @description
 * Type for extended action containing `actionGroup` property
 */
export interface GroupedAction {
  actionGroup: ActionGroup;
}

/**
 * @description
 * Type for extended failure action containing `error` property
 */
export interface FailurePayload extends GroupedAction {
  error?: Error;
}

/**
 * @description
 * Enum of possible loading state values
 */
export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED'
}

/**
 * @description
 * Base state for generic actions and reducers that sets error property by default
 */
export interface BaseState {
  loading: LoadingState;
  error: any;
}
/**
 * @description
 * Initial state value for base state that sets error to null by default
 */
export const baseInitialState: BaseState = {
  loading: LoadingState.IDLE,
  error: null
};

/**
 * @description
 * Configuration of reducer overrides for specific group of actions
 * Reducer can be replaced with any function that matches `ActionReducer` interface
 *
 * @param S Type of state
 * @param A Type of action
 */
export interface GroupedReducers<S, A extends Action> {
  loadReducer?: ActionReducer<S, A>;
  successReducer?: ActionReducer<S, A>;
  failureReducer?: ActionReducer<S, A>;
}

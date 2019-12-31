/**
 * @description
 * Enum of possible action groups
 */
import { Action, ActionReducer } from '@ngrx/store';

export const enum ActionGroup {
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
 * Base state for generic actions and reducers that sets error property by default
 */
export interface BaseState {
  error: any;
}
/**
 * @description
 * Initial state value for base state that sets error to null by default
 */
export const baseInitialState: BaseState = {
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
export interface ReducerHandlers<S, A extends Action> {
  loadReducer?: ActionReducer<S, A>;
  successReducer?: ActionReducer<S, A>;
  failureReducer?: ActionReducer<S, A>;
}


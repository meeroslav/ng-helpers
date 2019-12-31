/**
 * @description
 * Enum of possible action groups
 */
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

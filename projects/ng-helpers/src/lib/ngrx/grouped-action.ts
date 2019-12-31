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

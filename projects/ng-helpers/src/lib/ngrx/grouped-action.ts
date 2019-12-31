export const enum ActionGroup {
  LOAD = 'LOAD',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE'
}

export interface GroupedAction {
  actionGroup: ActionGroup;
}

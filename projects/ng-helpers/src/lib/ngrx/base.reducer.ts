import { ActionType, BaseAction, BaseFailedAction } from './base.actions';

export function baseReducer<T>(state: T,
                               // tslint:disable-next-line:ban-types
                               actions: Function[],
                               action: BaseAction<any>,
                               handlers?: ReducerHandlers<T>): T {
  if (actions.indexOf(action.constructor) === -1) {
    return state;
  }
  if (action.actionType === ActionType.LOADING) {
    return handlers && handlers.handleLoading
      ? handlers.handleLoading(state, action)
      : baseLoadingHandler(state, action);
  }
  if (action.actionType === ActionType.LOADED) {
    return handlers && handlers.handleLoaded
      ? handlers.handleLoaded(state, action)
      : baseLoadedHandler(state, action);
  }
  if (action.actionType === ActionType.FAILED) {
    return handlers && handlers.handleFailed
      ? handlers.handleFailed(state, action as BaseFailedAction)
      : baseFailedHandler(state, action as BaseFailedAction);
  }
  return null;
}

function baseLoadingHandler<T>(state: T, action: BaseAction<any>): T {
  return { ...state, error: null };
}

function baseLoadedHandler<T>(state: T, action: BaseAction<any>): T {
  return { ...state };
}

function baseFailedHandler<T>(state: T, action: BaseFailedAction): T {
  return { ...state, error: action.error };
}

export type ReducerHandler<T> = (state: T, action: BaseAction<any>) => T;

export interface ReducerHandlers<T> {
  handleLoading?: ReducerHandler<T>;
  handleFailed?: ReducerHandler<T>;
  handleLoaded?: ReducerHandler<T>;
}

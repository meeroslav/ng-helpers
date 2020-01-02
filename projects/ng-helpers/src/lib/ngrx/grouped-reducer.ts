import { Action, ActionCreator, ActionReducer, Creator } from '@ngrx/store';
import { ActionGroup, FailurePayload, GroupedAction, GroupedReducers, LoadingState } from './model';

export function createGroupedReducer<S, A extends GroupedAction & Action>(
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

function defaultLoadReducer<S>(state: S): S {
  return { ...state, loading: LoadingState.LOADING, error: null };
}

function defaultSuccessReducer<S>(state: S): S {
  return { ...state, loading: LoadingState.SUCCESSFUL };
}

function defaultFailedReducer<S, A extends FailurePayload>(state: S, action: A): S {
  return { ...state, loading: LoadingState.FAILED, error: action.error };
}

import { ActionCreator, Creator } from '@ngrx/store';
import { FunctionWithParametersType, TypedAction } from '@ngrx/store/src/models';
import { ActionGroup, FailurePayload, GroupedAction } from './model';

function groupedActionFactory<O extends object>(actionGroup: ActionGroup) {
  function createGroupedAction<T extends string>(
    type: T
  ): ActionCreator<T, () => GroupedAction & TypedAction<T>>;
  function createGroupedAction<T extends string, P extends O>(
    type: T,
    config: { _as: 'props'; _p: P }
  ): ActionCreator<T, (props: P) => P & GroupedAction & TypedAction<T>>;
  function createGroupedAction<
    T extends string,
    P extends any[],
    R extends O
    >(
    type: T,
    creator: Creator<P, R>
  ): FunctionWithParametersType<P, R & TypedAction<T>> & GroupedAction & TypedAction<T>;
  function createGroupedAction<T extends string, C extends Creator>(
    type: T,
    config?: { _as: 'props' } | C
  ): Creator {
    if (typeof config === 'function') {
      return defineGroupedType(type, actionGroup, (...args: any[]) => ({
        ...config(...args),
        type,
        actionGroup
      }));
    }
    const as = config ? config._as : 'empty';
    switch (as) {
      case 'empty':
        return defineGroupedType(type, actionGroup, () => ({ type, actionGroup }));
      case 'props':
        return defineGroupedType(type, actionGroup, (payload: O) => ({
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

function defineGroupedType(type: string, actionGroup: ActionGroup, creator: Creator): Creator {
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

export const createLoadAction = groupedActionFactory(ActionGroup.LOAD);
export const createSuccessAction = groupedActionFactory(ActionGroup.SUCCESS);
export const createFailureAction = groupedActionFactory<FailurePayload>(ActionGroup.FAILURE);

import { Action } from '@ngrx/store';

export enum ActionType {
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  FAILED = 'FAILED'
}

export abstract class BaseAction<T> implements Action {
  actionType = ActionType.LOADED;
  type = '//';
  constructor(public payload: T) {
    this.type = this.constructor.name;
  }
}

export abstract class BaseLoadAction<T> extends BaseAction<T> {
  actionType = ActionType.LOADING;
}

export abstract class BaseFailedAction extends BaseAction<any> {
  actionType = ActionType.FAILED;

  constructor(payload: any, public error: any = null) {
    super(payload);
  }
}

export type ActionClass<T extends Action> = new (...args) => T;

import { Action } from '@ngrx/store';
import { ActionGroup, GroupedAction } from './model';

/**
 * @description
 * Abstract generic action for load actions
 *
 * @param T Generic type of the payload
 *
 * @usageNotes
 *
 * ```ts
 * export class LoadProducts extends BaseLoadAction<string> { }
 * ```
 *
 * which is equivalent to:
 * ```ts
 * export class LoadProducts implements Action {
 *   readonly type = 'LoadProducts';
 *   readonly actionGroup = ActionGroup.LOAD;
 *
 *   constructor(public payload: string) { }
 * }
 * ```
 */
export abstract class BaseLoadAction<T> extends BaseAction<T> {
  actionGroup = ActionGroup.LOAD;
}
/**
 * @description
 * Abstract generic action for success actions
 *
 * @param T Generic type of the payload
 *
 * @usageNotes
 *
 * ```ts
 * export class ProductsLoaded extends BaseSuccessAction<Product[]> { }
 * ```
 *
 * which is equivalent to:
 * ```ts
 * export class ProductsLoaded implements Action {
 *   readonly type = 'ProductsLoaded';
 *   readonly actionGroup = ActionGroup.SUCCESS;
 *
 *   constructor(public payload: Product[]) { }
 * }
 * ```
 */
export abstract class BaseSuccessAction<T> extends BaseAction<T> {
  actionGroup = ActionGroup.SUCCESS;
}
/**
 * @description
 * Abstract generic action for failure actions
 *
 * @param T Generic type of the original load payload
 *
 * @usageNotes
 *
 * ```ts
 * export class ProductsLoadFailed extends BaseFailedAction<string> { }
 * ```
 *
 * which is equivalent to:
 * ```ts
 * export class ProductsLoadFailed implements Action {
 *   readonly type = 'ProductsLoadFailed';
 *   readonly actionGroup = ActionGroup.FAILURE;
 *
 *   constructor(public payload: string, public error: Error = null) { }
 * }
 * ```
 */
export abstract class BaseFailedAction<T> extends BaseAction<T> {
  actionGroup = ActionGroup.FAILURE;

  constructor(payload: T, public error: Error = null) {
    super(payload);
  }
}
// underlying generic structure for all actions
// extends Action and GroupedAction
// sets type to constructor name (not unique, but using Good Action Hygiene™ useful for debugging)
abstract class BaseAction<T> implements Action, GroupedAction {
  readonly actionGroup: ActionGroup;
  readonly type;

  constructor(public payload: T) {
    this.type = this.constructor.name;
  }
}

/**
 * @description
 * Union type for the grouped base actions:
 * - BaseLoadAction
 * - BaseFailedAction
 * - BaseSuccessAction
 */
export type BaseAction = BaseLoadAction | BaseFailedAction | BaseSuccessAction;

/**
 * @description
 * Type representing Action class (constructor)
 */
export type ActionClass<T extends Action> = (...args) => T;
/**
 * @description
 * Type representing Failed Action class (constructor)
 */
export type FailedActionClass<T extends BaseFailedAction> = (...args) => T;

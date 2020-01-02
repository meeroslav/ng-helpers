import { Action } from '@ngrx/store';
import { ActionGroup, GroupedAction } from './model';

// underlying generic structure for all actions
// extends Action and GroupedAction
// sets type to constructor name (not unique, but using Good Action Hygiene™ useful for debugging)
abstract class GenericAction<P> implements Action, GroupedAction {
  readonly actionGroup: ActionGroup;
  readonly type;

  constructor(public payload: P) {
    this.type = this.constructor.name;
  }
}
/**
 * @description
 * Abstract generic action for load actions
 *
 * @param P Generic type of the payload
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
export abstract class BaseLoadAction<P> extends GenericAction<P> {
  actionGroup = ActionGroup.LOAD;
}
/**
 * @description
 * Abstract generic action for success actions
 *
 * @param P Generic type of the payload
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
export abstract class BaseSuccessAction<P> extends GenericAction<P> {
  actionGroup = ActionGroup.SUCCESS;
}
/**
 * @description
 * Abstract generic action for failure actions
 *
 * @param P Generic type of the original load payload
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
export abstract class BaseFailedAction<P> extends GenericAction<P> {
  actionGroup = ActionGroup.FAILURE;

  constructor(payload: P, public error: Error = null) {
    super(payload);
  }
}

/**
 * @description
 * Union type for the grouped base actions:
 * - BaseLoadAction
 * - BaseFailedAction
 * - BaseSuccessAction
 */
export type BaseAction<P> = BaseLoadAction<P> | BaseFailedAction<P> | BaseSuccessAction<P>;

/**
 * @description
 * Type representing Action class (constructor)
 */
export type ActionClass = (...args) => void;
/**
 * @description
 * Type representing Failed Action class (constructor)
 */
export type FailedActionClass<T extends { error: Error }> = (...args) => void;

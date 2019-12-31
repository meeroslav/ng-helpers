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

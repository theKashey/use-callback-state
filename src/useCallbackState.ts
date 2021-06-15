import { useCallback, useDebugValue, useRef, useState } from 'react';

type IndirectDispatch<ReadState, WriteState> = (
  value: WriteState | ((old: ReadState) => WriteState),
  force?: false
) => void;
type DirectDispatch<ReadState> = (value: ReadState | ((old: ReadState) => ReadState), force?: true) => void;
type ForceDispatch<ReadState> = (value: ReadState | ((old: ReadState) => ReadState)) => void;

type Dispatch<ReadState, WriteState> = WriteState extends ReadState
  ? DirectDispatch<ReadState>
  : IndirectDispatch<ReadState, WriteState>;

/**
 * useState with integrated onChange callback
 * @param initialState - state
 * @param {(newState, oldState)=> State} changeCallback onchange callback with ability to stop state change propagation
 * @returns [state, setState]
 * @example
 * allow only EVEN values
 * ```
 * const [state, setState] = useCallbackState(2, (newState, oldState) => {
 *   return newState % 2 ? newState : oldState
 * }
 * ```
 *
 * @example
 * "onChange callback" - return nothing from onValueChange
 * ```
 * const [state, setState] = useCallbackState("value", newState => onValueChange(newState))
 * ```
 *
 * @example
 * Using different read and write states
 * ```
 * const [value, setValue] = useCallbackState("", (event: ChangeEvent<HTMLInputElement>, prevValue) => e.target.value)
 * ```
 *
 * @example
 * Skip hook and write directly to the state
 * ```js
 * setState("anyValue", true); // force update
 * ```
 */
export function useCallbackState<ReadState, WriteState = ReadState>(
  initialState: ReadState | (() => ReadState),
  changeCallback: (
    incomingValue: WriteState,
    storedValue: ReadState
  ) => WriteState extends ReadState ? ReadState | undefined | void : ReadState
): [ReadState, Dispatch<ReadState, WriteState>, ForceDispatch<ReadState>] {
  const [state, setState] = useState(initialState);
  const callbackRef = useRef(changeCallback);
  callbackRef.current = changeCallback;

  const updateState: any = useCallback((newState: any, forceUpdate?: boolean) => {
    if (forceUpdate) {
      setState(newState);
    } else {
      setState(oldState => {
        const appliedState = typeof newState === 'function' ? newState(oldState) : newState;

        const resultState = callbackRef.current(appliedState, oldState);
        return typeof resultState === 'undefined' ? appliedState : resultState;
      });
    }
  }, []);

  useDebugValue(state);

  return [state, updateState, setState];
}

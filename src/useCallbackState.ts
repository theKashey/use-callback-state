import { useCallback, useDebugValue, useRef, useState } from 'react';

type Dispatch<A> = (value: A | ((old: A) => A), force?: boolean) => void;

/**
 * useState with integrated onChange callback
 * @param initialState - state
 * @param {(newState, oldState)=> State} changeCallback onchange callback with ability to stop state change propagation
 * @example
 * // allow only even state
 * const [state, setState] = useCallbackState(2, (newState, oldState) => {
 *   return newState%2 ? newState : oldState
 * }
 *
 * // onChange callback
 * const [state, setState] = useCallbackState("value", newState => onValueChange(newState))
 *
 * // skip hook
 * setState("anyValue", true); // force update
 */
export function useCallbackState<S>(
  initialState: S | (() => S),
  changeCallback: (s: S, old: S) => S | undefined | void
): [S, Dispatch<S>] {
  const [state, setState] = useState(initialState);
  const callbackRef = useRef(changeCallback);
  callbackRef.current = changeCallback;

  const updateState = useCallback((newState, forceUpdate?: boolean) => {
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

  return [state, updateState];
}

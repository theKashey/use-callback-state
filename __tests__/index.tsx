import { act, renderHook } from '@testing-library/react-hooks';

import { ChangeEvent } from 'react';
import { useCallbackState } from '../src';

describe('Direct state', () => {
  it('Controls the state', () => {
    const spy = jest.fn();
    const { result } = renderHook(() =>
      useCallbackState(42, (newState, oldState) => {
        spy(newState, oldState);
        return newState + 1;
      })
    );

    expect(result.current[0]).toBe(42);
    expect(spy).not.toHaveBeenCalled();

    act(() => result.current[1](10));

    expect(result.current[0]).toBe(11);
    expect(spy).toHaveBeenCalledWith(10, 42);
  });

  it('Even Odd', () => {
    const spy = jest.fn();
    const { result } = renderHook(() =>
      useCallbackState(2, (newState, oldState) => {
        spy(newState, oldState);
        return newState % 2 ? oldState : newState;
      })
    );

    act(() => result.current[1](2));

    expect(result.current[0]).toBe(2);
    expect(spy).toHaveBeenCalledWith(2, 2);

    act(() => result.current[1](3));

    expect(result.current[0]).toBe(2);
    expect(spy).toHaveBeenCalledWith(3, 2);

    act(() => result.current[1](4));

    expect(result.current[0]).toBe(4);
    expect(spy).toHaveBeenCalledWith(4, 2);
  });

  it('Replace state', () => {
    let cb: any = () => undefined;
    const { result } = renderHook(() => useCallbackState(42, newState => cb(newState)));

    expect(result.current[0]).toBe(42);

    act(() => result.current[1](1));
    expect(result.current[0]).toBe(1);

    act(() => result.current[1](0));
    expect(result.current[0]).toBe(0);

    act(() => result.current[1](10));
    expect(result.current[0]).toBe(10);

    // replace callback
    cb = (newState: number) => newState + 1;
    act(() => result.current[1](10));
    expect(result.current[0]).toBe(11);
  });
});

describe('Indirect state', () => {
  it('number to string', () => {
    const spy = jest.fn();
    const { result } = renderHook(() =>
      useCallbackState('-', (newState: number, oldState) => {
        spy(newState, oldState);
        return oldState + String(newState);
      })
    );

    expect(result.current[0]).toBe('-');
    expect(spy).not.toHaveBeenCalled();

    act(() => result.current[1](1));

    expect(result.current[0]).toBe('-1');
    expect(spy).toHaveBeenCalledWith(1, '-');
  });

  it('should not fail TS', () => {
    renderHook(() =>
      useCallbackState('-', (event: ChangeEvent<HTMLInputElement>) => {
        return event.target.value;
      })
    );

    // we are checking TS
    expect(1).toBe(1);
  });
});

<div align="center">
  <h1>🤙 use-callback-state 📞</h1>
  <br/>
  The same `useState` but it will callback: 📞 Hello! Value is going to change!
  <br/>
    <a href="https://www.npmjs.com/package/use-callback-state">
      <img src="https://img.shields.io/npm/v/use-callback-state.svg?style=flat-square" />
    </a>
    <a href="https://travis-ci.org/theKashey/use-callback-state">
       <img alt="Travis" src="https://img.shields.io/travis/theKashey/use-callback-state/master.svg?style=flat-square">
    </a>
    <a href="https://bundlephobia.com/result?p=use-callback-state">
      <img src="https://img.shields.io/bundlephobia/minzip/use-callback-state.svg" alt="bundle size">
    </a> 
</div>

---

- reports when state got updated
- controls what could be set to the state
- helps with transformations

`useState` is about storing a variable, and changing it. However what if not everything could be set, and what if you have to react on state change?

## Why?

- to react on state change in the **same tick**, not **after** as usual, causing potential state tearing and inconsistency.
- for input value validation or transformation

## useReducer

- `useCallbackState` is quite similar to `useReducer`, it receives the old `state` and the `new`, producing the `result`. Use reducer does the same, and `action` could be action. However, you can't replace reducer, while `callback` in `useCallbackStart` would always refer to a latest version.

## Control

For state validation

```js
import { useCallbackState } from 'use-callback-state';
const [state, setState] = useCallbackState(
  2,
  // allow only even numbers
  (newState, oldState) => (newState % 2 ? oldState : newState)
);

state == 2;

setState(3);
state == 2; // 3 is odd number, the old state value was enforced

setState(4);
state == 4;
```

For form values management

```js
import { useCallbackState } from 'use-callback-state';
const [name, setName] = useCallbackState('John Doe', event => event.target.current);
return <input value={value} onChange={setValue} />;
```

## Report

```js
const [state, setState] = useCallbackState(
  42,
  newState => {
    onValueChange(newState);
  } // not returning anything means "nothing transformed"
);

setState(10);
// call onValueChange(10)
```

alternative

```js
const [state, setState] = useState(42);
useEffect(() => onValueChange(state), [state]);

// call onValueChange(42) (did you want it?)
setState(10);
// call onValueChange(10)
```

## State separation

One state is "public" - what would be reported to the parent component, and another is "internal" - what user would see.
A good example - a `DataInput` where "public value" could be `undefined` if it's not valid

```js
const [publicState, setPublicState] = useCallbackState(initialValue, onValueChange);

const [internalState, setInternalState] = useState(publicState);

useEffect(() => {
  setPublicState(isValid(internalState) ? internalState : undefined);
}, [internalState]);

return (
  <>
    <input type="hidden" value={publicState} />
    <input type="text" value={internalState} onChange={e => setInternalState(e.target.value)} />
  </>
);
```

# See also

- [use-callback-ref](https://github.com/theKashey/use-callback-ref) - the same `useRef` but it will callback.

# License

MIT

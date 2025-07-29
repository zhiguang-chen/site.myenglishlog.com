---
title: Redux
author: JumpToMars
tags: Frontend | React
created: 2025-07-29
updated: 2025-07-29
---

For Redux Toolkit, click [here](./redux-toolkit)

## Preparation

- React DevTools Extension for browsers.

## What is Redux? what does Redux do?

- It is a JS library.
- For managing and updating **global** state, it servers as a centralized store
  for state.
- UI dispatches **actions** and **reducers** updates the state.
- Redux Toolkit is the **standard** way to write Redux logic.
- Redux can integrate with any UI framework, not only React.

## Terms and Concepts

### State Management

- **State** is the source of truth, it describes the condition of the app at a
  specific point in time.
- **View** is the UI based on the current state.
- **Action** is the event that triggers the updates in the state.

Redux extracts the shared state from the components tree and puts it into a
centralized location.

### Immutability

**React and Redux expect that all state updates are done immutably**

## Terminology

### Actions

- It is a plain JavaScript object that has a string `type` field.
- The `type` should be a descriptive name, follows the `"domain/eventName"`
  pattern, like `"todos/todoAdded"`.
- We should see an action as **"an event that occurred in the app"**, rather
  than **"a command to set a value"**.
- The additional information should be put in a field called **payload**

Example:

```ts
const addTodoAction = {
  type: 'todos/todoAdded',
  payload: 'Buy milk',
};
```

_Redux **actions** and **state** should only contain plain JS values like
**objects**, **arrays**, and **primitives**. Don't put class instances,
functions, **Date/Map/Set** instances, or other **non-serializable** values into
Redux!._

### Action Creators

A function returns an action object:

```ts
const addTodo = (text) => {
  return {
    type: 'todos/todoAdded',
    payload: text,
  };
};
```

### Reducers

- A function that receives the current `state` and an `action`, and returns the
  new state: `(state, action) => newState`.
- It shuold only calculate the new state value based on the `state` and `action`
  arguments.
- It must not immute the existing `state`.
- It cannot do any asynchronous logic, calculate random values, or cause other
  "side effects".

Example:

```ts
const initialState = { value: 0 };

function counterReducer(state = initialState, action) {
  // Check to see if the reducer cares about this action
  if (action.type === 'counter/increment') {
    // If so, make a copy of `state`
    return {
      ...state,
      // and update the copy with the new value
      value: state.value + 1,
    };
  }
  // otherwise return the existing state unchanged
  return state;
}
```

It is called reducer because it works similar to `Array.reduce`, like in this
example:

```ts
const actions = [
  { type: 'counter/increment' },
  { type: 'counter/increment' },
  { type: 'counter/increment' },
];

const initialState = { value: 0 };
type State = typeof initialState;
type Action = (typeof actions)[0];

const counterReducer = (state: State, action: Action) => {
  if (action.type === 'counter/increment') {
    return {
      value: state.value + 1,
    };
  }

  return state;
};

const finalResult = actions.reduce(counterReducer, initialState);
console.log(finalResult);
```

### Store

It is where the state lives.

This example blow shows how to use `configureStore` from Redux Toolkit, by by
passing a `reducer`. We can use `store.getState()` to get the current state
value:

```ts
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({ reducer: counterReducer });

console.log(store.getState());
// {value: 0}
```

### Dispatch

- It is a method used `action` as the parameter.
- It is the only way to update the `state`.

So we can say `dispatch` **triggers an event**, then `reducer` handles the state
updating.

Example:

```ts
store.dispatch({ type: 'counter/increment' });

console.log(store.getState());
```

Or call an action creator to dispatch the action:

```ts
const increment = () => {
  return {
    type: 'counter/increment',
  };
};

store.dispatch(increment());

console.log(store.getState());
```

### Selector

A functions that extracts a piece of information from `state`, so you do not
have to repeat the same logic again and again in your application.

```ts
const selectCounterValue = (state) => state.value;

const currentValue = selectCounterValue(store.getState());
console.log(currentValue);
```

## Redux Application Data Flow

It is a "one-way data flow".

### Initial setup

- A Redux store is created using a root reducer function.
- The store calls the root reducer once, and saves the return value as its
  initial `state`.
- UI is first rendered with the initial `state`.
- Subscribe to any future store updates so UI can know if the state has changed.

### Updates

- Something happens, such as a user clicking a button.
- Dispatches an `action` to the Redux store.
- The store runs the reducer, and the `state` is updated.
- The store notifies the subscribers that the store has been updated.
- Re-render the UI if the needed data have been changed.

## References

[Redux Essentials, Part 1: Redux Overview and Concepts](https://redux.js.org/tutorials/essentials/part-1-overview-concepts)

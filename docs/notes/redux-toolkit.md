---
title: Redux Toolkit(RTK)
author: MyEnglishLog
tags: Frontend | React
created: 2025-07-28
updated: 2025-07-29
---

## Overview

- RTK is a wrapper around the **core Redux**, an approach for writing Redux
  logic.
- RTK automatically configure the Redux DevTools extension.
- RTK is the **standard** way to write Redux logic.

## Preparation

### Create a React project, add Redux dependencies

```
npm create vite@latest
npm install @reduxjs/toolkit react-redux
```

### set up msw

```
npx msw init public/ --save
```

More on: <https://mswjs.io/>

## Simple example

### Redux Store

```ts
// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

// Create a Redux store
export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Provide the Redux Store to React

```ts
// main.tsx
import { store } from './app/store';
import { Provider } from 'react-redux';

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

### Redux State Slice

Note that Redux requires us not to mutate state, but RTK's `createSlice` and
`createReducer` APIs use `Immer` internally to allow us to "mutate" state(it
creates copies under the hood).

```ts
// features/counter/counterSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
```

We can also export something else from slice files, such as selectors:

```ts
export const selectCount = (state: RootState) => state.counter.value;
```

In some cases, we can caste the initial state by using `as`, see: \
<https://redux-toolkit.js.org/tutorials/typescript#define-slice-state-and-action-types>

### Dispatch actions

```ts
// features/counter/Counter.ts
import React from 'react';
import type { RootState } from '../../app/store';
import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment } from './counterSlice';

export function Counter() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  );
}
```

### Good to have: Define Typed Hooks

So we do not have to import the `RootState` and `AppDispatch` types into each
component.

```ts
// app/hooks.ts
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

## Terminology

### Slices

A collection of Redux reducer logic and actions for a single feature of an app,
typically defined together in a single file. The name comes from splitting up
the root Redux state object into multiple "slices" of state.

## RTK Query

## Others

### extraReducers

Use `extraReducers` to handle actions that were defined outside of the slice.

### Store

### Dispatch

### Selectors

- Any time an action has been dispatched and the Redux store has been updated,
  useSelector will re-run the selector function.
- Selectors can be written in slice files, or inline in the `useSelector` hook.

### Thunks

A **thunk** is a specific kind of Redux function that can contain asynchronous
logic. We can use them the same way we use a typical Redux action creator:

```ts
await store.dispatch(incrementAsync(6));
```

- Thunks receive `dispatch` and `getState` as arguments
- Redux Toolkit enables the `redux-thunk` middleware by default
- A thunk function can contain any logic, sync or async.
- For consistency with dispatching normal action objects, we typically write
  these as thunk action creators,
- Thunks are typically written in "slice" files
- Redux Toolkit provides a `createAsyncThunk` API to implement the creation and
  dispatching of actions describing an async request

### Normalized state

which means:

- Only have one copy of each particular piece of data in our state, so there's
  no duplication
- Data that has been normalized is kept in a lookup table, where the item IDs
  are the keys, and the items themselves are the values. This is typically just
  a plain JS object.
- There may also be an array of all of the IDs for a particular item type.

For example:

```ts
{
  users: {
    ids: ["user1", "user2", "user3"],
    entities: {
      "user1": {id: "user1", firstName, lastName},
      "user2": {id: "user2", firstName, lastName},
      "user3": {id: "user3", firstName, lastName},
    }
  }
}
```

#### createEntityAdapter

The returned object contains:

- a set of generated reducer functions, such as `.setAll`

## Some other

In reducers(We known it contains Immer), you can either "mutate" an existing
state object, or return a new state value yourself, but not both at the same
time.

### createAsyncThunk

```ts
export const fetchPosts = createAppAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get<Post[]>('/fakeApi/posts');
  return response.data;
});
```

**Arguments Explanation**

- A string that will be used as the prefix for the generated action types
- A **"payload creator"** callback function. It can either return the Promise
  from the HTTP request directly, or extract some data from the API response and
  return that.

We can also define Thunks Inside of createSlice:
https://redux.js.org/tutorials/essentials/part-5-async-logic#optional-defining-thunks-inside-of-createslice

### useSelector

`useSelector` will **re-run every time an action is dispatched**, and that it
forces the component to **re-render if we return a new reference value**.

### Memoized selectors: createSelector

A function that generates memoized selectors that will only recalculate results
when the inputs change

```ts
export const selectPostsByUser = createSelector(
  // Pass in one or more "input selectors"
  [
    // we can pass in an existing selector function that
    // reads something from the root `state` and returns it
    selectAllPosts, // or (state: RootState) => selectAllPosts(state),
    // and another function that extracts one of the arguments
    // and passes that onward
    (_state: RootState, userId: string) => userId,
  ],
  // the output function gets those values as its arguments,
  // and will run when either input value changes
  (posts, userId) => posts.filter((post) => post.user === userId)
);
```

or like this:

```ts
export const selectPostsByUser = createSelector(
  selectAllPosts,
  (_state: RootState, userId: string) => userId,
  (posts, userId) => posts.filter((post) => post.user === userId)
);
```

#### Performance Issue

React's default behavior is that **when a parent component renders, React will
recursively render all child components inside of it!**

Because of the **immutable** update, for the reference type state, each update
will create a new reference, which will cause a re-render.

https://redux.js.org/tutorials/essentials/part-6-performance-normalization#investigating-the-posts-list

Solutions:

- Wrap the component in React.memo(), which will ensure that the component
  inside of it only re-renders if the props have actually changed.

#### some more important

```ts
// This could cause circular dependency when listenerMiddleware depend on
// something from current file
import { type AppStartListening } from '@/app/listenerMiddleware';

// use this instead:
import type { AppStartListening } from '@/app/listenerMiddleware';
```

## RTK Query

Manually dispatching an RTKQ request thunk will create a subscription entry, we
might need to unsbscribe from that data later, otherwise the data stays in the
cache permanently.

RTK Query uses a "document cache" approach, not a "normalized cache". We can use
`createEntityAdapter` to normalize the response data, but this is not the same
thing as a "normalized cache" - we only transformed how this one response is
stored rather than deduplicating results across endpoints or requests.

## references

## TODO

- learn react-router
- `Object.entries`, `Object.values`
- learn
  <https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#customizing-queries-with-basequery>
- learn <https://api.reactrouter.com/v7/types/react_router.LoaderFunction.html>
  <https://github.com/reduxjs/redux-toolkit/discussions/2751>
- Some other data fetching packages

### What is this `satisfies`

```ts
// Workaround: cast state instead of declaring variable type
const initialState = {
  value: 0,
} satisfies CounterState as CounterState;
```

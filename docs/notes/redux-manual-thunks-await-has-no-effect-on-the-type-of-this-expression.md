---
title: Redux manual thunks: 'await' has no effect on the type of this expression
tags: Frontend | React
created: 2025-08-06
updated: 2025-08-06
---

## Code

```ts
import {
  configureStore,
  createSlice,
  type Action,
  type PayloadAction,
  type ThunkAction,
} from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: 3,
  reducers: {
    incrementByAmount: (state: number, action: PayloadAction<number>) => {
      return state + action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

type RootState = ReturnType<typeof store.getState>;

type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;

const incrementAsync = (amount: number): AppThunk => {
  return async (dispatch) => {
    await new Promise((r) => setTimeout(r, 1000));
    dispatch(counterSlice.actions.incrementByAmount(amount));
  };
};

async function main() {
  await store.dispatch(incrementAsync(6));
  console.log(store.getState());
}

main();
```

## Problem

The `await` takes effect, but the type system does not know the return type of
the action is an promise.

## Solution

You will be shocked, just change

```ts
const incrementAsync = (amount: number): AppThunk
```

to

```ts
const incrementAsync = (amount: number): AppThunk<Promise<void>>
```

## Why did I spend at least 2 hours figuring it out?

I copied the `AppThunk` type definition from Redux tutorials without trying to
understand it. It's clear there's a generic type `ThunkReturnType`. It might
have been more obvious if `T` were used to represent this generic type.

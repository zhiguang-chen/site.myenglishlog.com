---
title: How to Use an Async Thunk to Renew an Access Token Outside of the RTK Query API
tags: Frontend | React | Redux
created: 2025-08-07
updated: 2025-08-07
---

Save the code as `example.ts`, then run `node example.ts`

```ts
import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import {
  createApi,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
  type QueryReturnValue,
} from '@reduxjs/toolkit/query';

const renewAccessToken = createAsyncThunk(
  'auth/renewAccessToken',
  async (token: string) => {
    console.log(
      `Thunk: refreshToken "${token}" is being sent to the server, waiting...`
    );

    await new Promise((r) => setTimeout(r, 1000));

    const accessToken = 'I-am-a-new-accessToken';
    console.log(`Thunk: New accessToken "${accessToken}" received.`);
    return accessToken;
  }
);

// =============
// authSlice
interface AuthState {
  accessToken?: string;
}

const initialState: AuthState = {};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(renewAccessToken.fulfilled, (state, action) => {
      state.accessToken = action.payload;
    });
  },
});

// =============
// apiSlice
const baseQueryWithReauth: BaseQueryFn<
  FetchArgs,
  unknown,
  FetchBaseQueryError,
  unknown,
  FetchBaseQueryMeta
> = async (_args, api) => {
  const accessToken = (api.getState() as { auth: AuthState }).auth.accessToken;

  if (!accessToken) {
    console.log(
      'Base Query: I need a new accessToken, dispatch renewAccessToken thunk'
    );
    await api.dispatch(renewAccessToken('I-am-an-refreshToken'));
    console.log('Base Query: Forward the query');
  } else {
    console.log('Base Query: I have a valid accessToken, forward the query');
  }

  const result: QueryReturnValue<
    null,
    FetchBaseQueryError,
    FetchBaseQueryMeta
  > = {
    data: null,
  };

  return result;
};

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    me: builder.query<void, void>({
      query: () => {
        console.log('Endpoint: /me');
        return {
          url: '/me',
        };
      },
    }),
  }),
});

// =============
// store
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// Example
// run: node example.ts
(async () => {
  await store.dispatch(apiSlice.endpoints.me.initiate());
  console.log('\n--- send a request again ---');
  await store.dispatch(
    apiSlice.endpoints.me.initiate(undefined, {
      forceRefetch: true,
    })
  );
})();
```

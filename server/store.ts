// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { rnSocialApi } from "./api";

export const store = configureStore({
  reducer: {
    [rnSocialApi.reducerPath]: rnSocialApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rnSocialApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

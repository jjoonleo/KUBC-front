import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import eventsSlice from "./slices/eventsSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    events: eventsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

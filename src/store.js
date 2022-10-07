import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './sessionReducer';

export const store = configureStore({
  reducer: {
    sessions: sessionReducer,
  },
});

import { configureStore } from '@reduxjs/toolkit';
import departmentsReducer from './reducers/departmentsReducer';
import reportReducer from './reducers/reportReducer';
import sessionReducer from './reducers/sessionReducer';
import userReducer from './reducers/userReducer';

export const store = configureStore({
  reducer: {
    sessions: sessionReducer,
    reports: reportReducer,
    users: userReducer,
    departments: departmentsReducer
  },
});

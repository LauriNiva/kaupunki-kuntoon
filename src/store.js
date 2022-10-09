import { configureStore } from '@reduxjs/toolkit';
import publicReportReducer from './reducers/publicReportReducer';
import reportReducer from './reducers/reportReducer';
import sessionReducer from './reducers/sessionReducer';
import userReducer from './reducers/userReducer';

export const store = configureStore({
  reducer: {
    sessions: sessionReducer,
    reports: reportReducer,
    publicReports: publicReportReducer,
    users: userReducer
  },
});

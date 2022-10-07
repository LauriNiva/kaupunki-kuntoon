import { createSlice } from '@reduxjs/toolkit';
import { getOwnReports } from '../services/report.service';

const reportSlice = createSlice({
  name: 'report',
  initialState: [],
  reducers: {
    setReports: (state, action) => {
      return action.payload;
    },
    addReport: (state, action) => {
      return state.concat(action.payload);
    },
  },
});

export const { setReports, clearReports } = reportSlice.actions;

export const setInitialReports = (userid) => {
  return async (dispatch) => {
    if (userid) {
      const reports = await getOwnReports(userid);
      dispatch(setReports(reports));
    }
  };
};

export default reportSlice.reducer;

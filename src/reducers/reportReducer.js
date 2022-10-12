import { createSlice } from '@reduxjs/toolkit';
import { getOwnReports } from '../services/report.service';

const reportSlice = createSlice({
  name: 'report',
  initialState: [],
  reducers: {
    setReports: (state, action) => {
      return action.payload;
    },
    concatNewReport: (state, action) => {
      return state.concat(action.payload);
    },
  },
});

export const { setReports, concatNewReport } = reportSlice.actions;

export const setInitialReports = (userid) => {
  return async (dispatch) => {
    if (userid) {
      const reports = await getOwnReports(userid);
      dispatch(setReports(reports));
    } else {
      dispatch(setReports([]));

    }
  };
};

export default reportSlice.reducer;

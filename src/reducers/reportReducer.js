import { createSlice } from '@reduxjs/toolkit';
import { getAllReports, getGroupReports, getOwnReports } from '../services/report.service';

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

export const setInitialReports = (user) => {
  return async (dispatch) => {
    if (user) {
      let reports;
      if (user.role === 'user') {
        reports = await getOwnReports(user.id);
      } else if (user.role === 'employee'){
        reports = await getGroupReports(user.departments.map(d => d.id));
      } else if (user.role === 'operator'){
        reports = await getAllReports(user.id);
      }
      dispatch(setReports(reports));
    } else {
      dispatch(setReports([]));
    }
  };
};

export default reportSlice.reducer;

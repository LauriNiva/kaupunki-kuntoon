import { createSlice } from '@reduxjs/toolkit';
import { getPublicReports } from '../services/report.service';

const publicReportSlice = createSlice({
  name: 'publicReport',
  initialState: [],
  reducers: {
    setPublicReports: (state, action) => {
      return action.payload;
    },
  },
});

export const { setPublicReports } = publicReportSlice.actions;

export const setInitialPublicReports = () => {
  return async (dispatch) => {
    const reports = await getPublicReports();
    dispatch(setPublicReports(reports));
  };
};

export default publicReportSlice.reducer;

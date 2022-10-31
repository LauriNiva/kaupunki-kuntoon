import { createSlice } from '@reduxjs/toolkit';
import { getAllReports } from '../services/report.service';

const reportSlice = createSlice({
  name: 'reports',
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
    const fetchedReports = await getAllReports();
    let reports;

    console.log('fetchedReports', fetchedReports);
    if (user) {
      console.log('user', user);
      const publicreports = fetchedReports.filter(
        (report) => report.public === true
      );
      const ownreports = fetchedReports.filter(
        (report) => report.user_id === user.id
      );
      const departmentreports = fetchedReports.filter((report) =>
        user.departments.includes(report.department)
      );

      reports = {
        public: publicreports,
        own: ownreports,
        department: departmentreports,
      };

      if (user.role === 'operator') {
        reports.all = fetchedReports;
      }
    } else {
      reports = {
        public: fetchedReports,
      };
    }
    dispatch(setReports(reports));
  };
};

export default reportSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';

const departmentSlice = createSlice({
  name: 'departments',
  initialState: [],
  reducers: {
    setDepartments: (state, action) => {
      return action.payload;
    },
  },
});

export const { setDepartments } = departmentSlice.actions;

export const setInitialDepartments = () => {
  return async (dispatch) => {
    const { error, data } = await supabase.from('departments').select();
    if (error) console.log(error);
    if (data) {
      console.log(data);
      let departmentObject = {};
      data.forEach((d) => (departmentObject[d.id] = d.name));
      dispatch(setDepartments(departmentObject));
    }
  };
};

export default departmentSlice.reducer;

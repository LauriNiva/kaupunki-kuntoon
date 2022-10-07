import { createSlice } from '@reduxjs/toolkit';
import {
  signInWithEmailAndPassword,
  signInWithMagiclink,
} from './services/auth.service';

const sessionSlice = createSlice({
  name: 'session',
  initialState: null,
  reducers: {
    setSession: (state, action) => {
      return action.payload;
    },
    removeSession: () => {
      return null;
    },
  },
});

export const { setSession, removeSession } = sessionSlice.actions;

export const loginUser = (email, password) => {
  return async (dispatch) => {
    if (!password) {
      await signInWithMagiclink(email);
    } else {
      await signInWithEmailAndPassword(email, password);
    }
  };
};

export default sessionSlice.reducer;

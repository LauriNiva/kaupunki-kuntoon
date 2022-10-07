import { createSlice } from '@reduxjs/toolkit';
import {
  signInWithEmailAndPassword,
  signInWithMagiclink,
  signOut,
} from '../services/auth.service';

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

export const signoutUser = () => {
  return async (dispatch) => {
    await signOut();
    dispatch(removeSession);
  }
}

export default sessionSlice.reducer;

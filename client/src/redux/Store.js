import { configureStore } from '@reduxjs/toolkit';
import progSlice from './slices/progSlice';
import { authReducer } from './slices/auth';
import pageSlice from './slices/page';

export const store = configureStore({
  reducer: {
    progSlice,
    authReducer,
    pageSlice,
  },
});

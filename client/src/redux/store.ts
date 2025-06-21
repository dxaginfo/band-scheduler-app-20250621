import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import rehearsalReducer from './slices/rehearsalSlice';
import songReducer from './slices/songSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rehearsals: rehearsalReducer,
    songs: songReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

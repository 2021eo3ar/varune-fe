import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import creditsReducer from './slices/creditsSlice';
import narrativesReducer from './slices/narrativesSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    credits: creditsReducer,
    narratives: narrativesReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
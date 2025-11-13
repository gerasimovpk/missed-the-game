import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import { scorebatApi } from './services/scorebatApi';
import spoilerSlice from './slices/spoilerSlice';
import userSlice from './slices/userSlice';
import favoritesSlice from './slices/favoritesSlice';
import uiSlice from './slices/uiSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['spoiler', 'favorites', 'ui'], // Only persist these slices
};

const rootReducer = combineReducers({
  spoiler: spoilerSlice,
  user: userSlice,
  favorites: favoritesSlice,
  ui: uiSlice,
  [scorebatApi.reducerPath]: scorebatApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(scorebatApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

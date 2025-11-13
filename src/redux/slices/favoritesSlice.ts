import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Favorite {
  teamId: string;
  teamName: string;
  addedAt: string;
}

interface FavoritesState {
  favorites: Favorite[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  favorites: [],
  isLoading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Favorite>) => {
      const existingIndex = state.favorites.findIndex(fav => fav.teamId === action.payload.teamId);
      if (existingIndex === -1) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(fav => fav.teamId !== action.payload);
    },
    setFavorites: (state, action: PayloadAction<Favorite[]>) => {
      state.favorites = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearFavorites: (state) => {
      state.favorites = [];
      state.error = null;
    },
  },
});

export const { 
  addFavorite, 
  removeFavorite, 
  setFavorites, 
  setLoading, 
  setError, 
  clearFavorites 
} = favoritesSlice.actions;
export default favoritesSlice.reducer;

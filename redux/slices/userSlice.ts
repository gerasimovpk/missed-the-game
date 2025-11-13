import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';

interface UserState {
  user: User | null;
  profile: {
    email: string;
    marketingConsent: boolean;
    createdAt: string;
  } | null;
  settings: {
    spoilerDefault: boolean;
    donationAck: boolean;
    updatedAt: string;
  } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  profile: null,
  settings: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.error = null;
    },
    setProfile: (state, action: PayloadAction<UserState['profile']>) => {
      state.profile = action.payload;
    },
    setSettings: (state, action: PayloadAction<UserState['settings']>) => {
      state.settings = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.profile = null;
      state.settings = null;
      state.error = null;
    },
  },
});

export const { setUser, setProfile, setSettings, setLoading, setError, clearUser } = userSlice.actions;
export default userSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SpoilerState {
  isOn: boolean;
  defaultMode: boolean;
}

const initialState: SpoilerState = {
  isOn: true, // Default to spoilers ON
  defaultMode: true,
};

const spoilerSlice = createSlice({
  name: 'spoiler',
  initialState,
  reducers: {
    toggleSpoilers: (state) => {
      state.isOn = !state.isOn;
    },
    setSpoilersOn: (state, action: PayloadAction<boolean>) => {
      state.isOn = action.payload;
    },
    setDefaultMode: (state, action: PayloadAction<boolean>) => {
      state.defaultMode = action.payload;
    },
  },
});

export const { toggleSpoilers, setSpoilersOn, setDefaultMode } = spoilerSlice.actions;
export default spoilerSlice.reducer;

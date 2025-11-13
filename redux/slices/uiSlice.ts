import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  authModalOpen: boolean;
  installPromptShown: boolean;
  cookieBannerDismissed: boolean;
  donationAckLocal: boolean;
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
  }>;
}

const initialState: UIState = {
  authModalOpen: false,
  installPromptShown: false,
  cookieBannerDismissed: false,
  donationAckLocal: false,
  toasts: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setAuthModalOpen: (state, action: PayloadAction<boolean>) => {
      state.authModalOpen = action.payload;
    },
    setInstallPromptShown: (state, action: PayloadAction<boolean>) => {
      state.installPromptShown = action.payload;
    },
    setCookieBannerDismissed: (state, action: PayloadAction<boolean>) => {
      state.cookieBannerDismissed = action.payload;
    },
    setDonationAckLocal: (state, action: PayloadAction<boolean>) => {
      state.donationAckLocal = action.payload;
    },
    addToast: (state, action: PayloadAction<Omit<UIState['toasts'][0], 'id'>>) => {
      const toast = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { 
  setAuthModalOpen, 
  setInstallPromptShown, 
  setCookieBannerDismissed, 
  setDonationAckLocal,
  addToast, 
  removeToast, 
  clearToasts 
} = uiSlice.actions;
export default uiSlice.reducer;

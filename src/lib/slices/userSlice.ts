import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserProfile {
  id: string
  name: string
  email: string
  image?: string
  bio?: string
  location?: string
  website?: string
  phone?: string
  preferences: {
    emailNotifications: boolean
    pushNotifications: boolean
    marketingEmails: boolean
    theme: 'light' | 'dark' | 'system'
    language: string
  }
}

interface UserState {
  profile: UserProfile | null
  loading: boolean
  error: string | null
  preferences: UserProfile['preferences']
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
  preferences: {
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    theme: 'system',
    language: 'en',
  },
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload
      state.preferences = action.payload.preferences
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload }
      }
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserProfile['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload }
      if (state.profile) {
        state.profile.preferences = state.preferences
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearUser: (state) => {
      state.profile = null
      state.error = null
      state.loading = false
    },
  },
})

export const {
  setUserProfile,
  updateProfile,
  updatePreferences,
  setLoading,
  setError,
  clearUser,
} = userSlice.actions

export default userSlice.reducer
import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    photo: null
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null
    },
    photo: (state, action) =>{
      state.photo = action.payload;
    },
    photoReset: (state) =>{
      state.photo = null
    }
  }
});

export const { login, logout, photo, photoReset } = userSlice.actions;
export const selectUser = (state) => state.user.user
export const selectPhoto = (state) => state.user.photo
export default userSlice.reducer;
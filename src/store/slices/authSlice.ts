import { createSlice } from "@reduxjs/toolkit";
type Token = null | string

interface AuthInterface{
    user:string|null
    token : Token
}
const initialState:AuthInterface = {
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem('token',action.payload)
    },
    setUserData(state, action) {
      state.user = action.payload;
      localStorage.setItem("user",JSON.stringify(action.payload))
    }
  },
});

export const { setToken, setUserData } = authSlice.actions;
export default authSlice.reducer;
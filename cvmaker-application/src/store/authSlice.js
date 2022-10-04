import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
    name: 'auth',
    initialState: {isLoggedIn: false, userData: {}},
    reducers:{
        logIn(state){
            state.isLoggedIn = true;
        },
        logOut(state){
            localStorage.removeItem('isLoggedIn')
            state.isLoggedIn = false;            
            
        },
        userInfo(state, action){
            state.userData = action.payload;
        }
    }
})


export const {logIn, logOut, userInfo} = authSlice.actions;
export default authSlice.reducer;
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import cvReducer from "./cvSlice"
import stickyReducer from "./stickyMsgSlice"

export const store = configureStore({
  reducer:{
    auth: authReducer,
    cv: cvReducer,
    stickMsg: stickyReducer
  }
})

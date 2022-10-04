import { createSlice } from "@reduxjs/toolkit";

const stickyMsgSlice = createSlice({
    name: 'stickMsg',
    initialState: {show: false,   type: 'error',    msg:'', title: '' },
    reducers:{
        setMsg(state,action){
            state.show = action.payload.show;
            state.type = action.payload.type
            state.msg = action.payload.msg
            state.title = action.payload.title
        },
        closeStickyMSg(state){
            state.show = false
        }
    }
})

export const {setMsg,closeStickyMSg} = stickyMsgSlice.actions;
export default stickyMsgSlice.reducer;
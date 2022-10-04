import { createSlice } from "@reduxjs/toolkit";
const cvSlice = createSlice({
    name: 'cv',
    initialState: {cvData: []},
    reducers:{
        storeCvData(state,action){
            let pay = action.payload;
            state.cvData = pay
            //console.log(action)
        },
        removeOneCv(state,action){
            const cvid = action.payload;
            const newCvs = state.cvData.filter((item)=>{
                return item._id!==cvid
            })

            state.cvData = newCvs;
        }
    }
})

export const {storeCvData,removeOneCv} = cvSlice.actions;
export default cvSlice.reducer;
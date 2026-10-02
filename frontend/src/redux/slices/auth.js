import { createSlice } from "@reduxjs/toolkit"
import { authApi } from "../../mocks/auth";

const initialState={
    user:{}
}

const slice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        getUser(state,action){
            console.log(action.payload)
          state.user = {...action.payload}
         },
        updateUser(state,action){
            let data = action.payload.data
        state.user = {...state.user, ...data}
        },
        deleteUser(state,action){
         let data = action.payload.data;
         state.user = {}
        },
        logoutUser(state,action){
            state.user = {}
         }
    }
})


export const {reducer} = slice;


    export const register = (data)=> async (dispatch)=>{
      try {
            const result = await authApi.signup(data)
        console.log(result);
        if(result.data.status  === "SUCCESS"){
            return result.data
        }else{
            return false
        }
    } catch (error) {
        console.log(error); 
    }
    }

    export const login =(data) => async (dispatch) =>{
       try {
        const result = await authApi.login(data);
        if (result){
            // localStorage.setItem("accessToken",result.data.token)
            // alert('yes');
            return result.data;
        }
        return false
    } catch (e) {
        console.log(e);
    }
   }

   export const logoutUser = () => async(dispatch) =>{
     console.log('logout')
     await dispatch(slice.actions.logoutUser())
     return true;
   }

    export const getUser = ()=> async (dispatch)=>{
     try {
        const result = await authApi.getUser()
        console.log(result,'result')
        if(result){
          await dispatch(slice.actions.getUser(result.data))
        }else{
            return false
        }
    } catch (error) {
       console.log(error); 
    }
    }

    export const updateUser = (data,id)=> async (dispatch) =>{
        console.log(data)
        const result = await authApi.updateUser(data,id);
        console.log(result)
        if(result){
            await dispatch(slice.actions.updateUser(result))
            return true
        }
        return false
        
    }
    
    export const deleteUser = (id)=> async (dispatch) =>{
        const result = await authApi.deleteUser(id);
        if(result){
            await dispatch(slice.actions.deleteUser(result))
            return true
        }
        return false
        
    }

    
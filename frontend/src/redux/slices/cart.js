
import { cartApi } from "@/mocks/cart";
import {Slice, createSlice} from "@reduxjs/toolkit";
const initialState = {
    carts:[], 
    cartsPaginator:{}, 
}


const slice = createSlice({
    name:"cart",
    initialState,
    reducers:{
      
        createCart(state,action){
          let event =  action.payload
         state.carts =[event,...state.carts]
         state.cartsPaginator.itemCount =  state.cartsPaginator.itemCount +1
        },

        readCart(state,action){
            state.carts =[...action.payload.data]
            state.cartsPaginator = {...action.payload.paginator}
           },

        updateCart(state,action){
        let event= action.payload.data
            state.carts = state.carts.map((item) => {
                if(item.id===event.id)
                return event;
                return item;
            })
            
           },
       
        deleteCart(state,action){
            let id = action.payload
         state.carts =  state.carts.filter((item) => item.id!==id)
         state.cartsPaginator.itemCount =  state.cartsPaginator.itemCount -1
        },

        deleteMany(state,actions){
            state.carts = []
            // state.cartsPaginator.itemCount =  0
        }
     
    }

});

export const {reducer} = slice


export const createCart = (data) => async (dispatch) =>{
    const result = await cartApi.createCart(data);
    console.log(result)
    if(result.status==='SUCCESS'){
        await dispatch(slice.actions.createCart(result.data))
        return true
    }
    return false
}

export const readCart = (page=1,limit=10,filters={}) => async (dispatch) =>{
    const result = await cartApi.readCart(page,limit,filters);
    console.log(result)
    if(result.status==='SUCCESS'){
        await dispatch(slice.actions.readCart(result.data))
        return true
    }
    return false
}


export const updateCart = () => async (dispatch) =>{
    const result = await cartApi.updateCart();
    if(result.status==='SUCCESS'){
        await dispatch(slice.actions.updateCart(result.data))
        return true
    }
    return false
}

export const deleteCart = (id={})=> async (dispatch) =>{
    const result = await cartApi.deleteCart(id);
    if(result){
        await dispatch(slice.actions.deleteCart(id))
        return true
    }
    return false
    
}

export const deleteMany = (ids={})=> async (dispatch) =>{
    const result = await cartApi.deleteMany(ids);
       if(result){
        await dispatch(slice.actions.deleteMany())
        return true
       }
       return false
    
}


export default slice;

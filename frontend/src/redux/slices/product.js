import { productApi } from "@/mocks/product";
import {Slice, createSlice} from "@reduxjs/toolkit";
const initialState = {
    products:[],
    productsPaginator:{},
    product:{}
}


const slice = createSlice({
    name:"product",
    initialState,
    reducers:{
      
        getProducts(state,action){
         state.products =[...action.payload.data]
         state.productsPaginator ={...action.payload.paginator}
        },

        getProduct(state,action){
            state.product = {...action.payload}
           },
       
        deleteProduct(id){
         state.product =  state.product.filter((item) => item.id!==id)
        },
       
        // getFilters(state,action){
        //     state.products =[...action.payload.data]
        //    },
    }

});

export const {reducer} = slice


export const getProducts = (page=1,limit=10,filters={}) => async (dispatch) =>{
    const result = await productApi.getProducts(page,limit,filters);
    if(result.status==='SUCCESS'){
        await dispatch(slice.actions.getProducts(result.data))
        return true
    }
    return false
}

export const getProduct = (id) => async (dispatch) =>{
    const result = await productApi.getProduct(id);
    if(result.status==='SUCCESS'){
        await dispatch(slice.actions.getProduct(result.data))
        return true
    }
    return false
}

export const deleteProduct = (id)=> async (dispatch) =>{
    const result = await productApi.deleteProduct(id);
    if(result){
        await dispatch(slice.actions.deleteProduct(id))
        return true
    }
    return false
    
}


// export const getFilters = (filters={}) => async (dispatch) =>{
//     const result = await productApi.getFilters(filters);
//     if(result.status==='SUCCESS'){
//         await dispatch(slice.actions.getFilters(result.data))
//         return true
//     }
//     return false
// }


export default slice;

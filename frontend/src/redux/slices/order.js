import { orderApi } from "@/mocks/order";
import {Slice, createSlice} from "@reduxjs/toolkit";
const initialState = {
    orders:[], 
    singleOrder:{},
    ordersPaginator:{}, 
}


const slice = createSlice({
    name:"order",
    initialState,
    reducers:{
      
        createOrder(state,action){
          let event =  action.payload
         state.orders =[event,...state.orders]
         state.ordersPaginator.itemCount =  state.ordersPaginator.itemCount +1
        },
        getOrder(state,action){
            state.orders =[...action.payload.data]
            state.ordersPaginator = {...action.payload.paginator}
           },
           getSingleOrder(state,action){
             state.singleOrder = {...action.payload}
           },
        updateOrder(state,action){
        let event= action.payload.data
            state.orders = state.orders.map((item) => {
                if(item.id===event.id)
                return event;
                return item;
            })
            
           },
       
        deleteOrder(state,action){
            let id = action.payload
         state.orders =  state.orders.filter((item) => item.id!==id)
         state.ordersPaginator.itemCount =  state.ordersPaginator.itemCount -1
        },
       
     
    }

});

export const {reducer} = slice


export const createOrder = (data) => async (dispatch) =>{
    const result = await orderApi.createOrder(data);
    console.log(result)
    if(result.status==='SUCCESS'){
        await dispatch(slice.actions.createOrder(result.data))
        return true
    }
    return false
}

export const getOrder = (page=1,limit=10,filters={}) => async (dispatch) =>{
    console.log(page)
    const result = await orderApi.getOrder(page,limit,filters);
    if(result.status==='SUCCESS'){
        await dispatch(slice.actions.getOrder(result.data))
        return result
    }
    return result
}

export const getSingleOrder = (id) => async(dispatch)=>{
  const result = await orderApi.getSignleOrder(id);
  if(result.status==='SUCCESS'){
    await dispatch(slice.actions.getSingleOrder(result.data))
    return result
  }
  return result
}


export const updateOrder = (data,id) => async (dispatch) =>{
    const result = await orderApi.updateOrder(data,id);
    if(result.status==='SUCCESS'){
        await dispatch(slice.actions.updateOrder(result.data))
        return true
    }
    return false
}

export const deleteOrder = (id)=> async (dispatch) =>{
    const result = await orderApi.deleteOrder(id);
    if(result){
        await dispatch(slice.actions.deleteOrder(id))
        return true
    }
    return false
    
}





export default slice;

import axios from "axios";


class CartApi{

    
    async createCart(data){
   
        const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/userapp/cart/create`,data,{
          method: "post",
          headers: { 
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
          }
        });
          if(response.data.status==='SUCCESS')
          return response.data;
          else
           return false;
      } 


      async readCart(page,limit,filters){
             let obj ={
          "query":filters,
          "options": {
          "collation": "",
          "sort": {"name":1},
          "populate": "products.productId",
          "projection": "",
          "lean": false,
          "leanWithId": true,
          "page": page,
          "limit": limit,
          "pagination": true,
          "useEstimatedCount": false,
          "useCustomCountFn": false,
          "forceCountFn": false,
          "read": {},
          "options": {}
        },
        "isCountOnly": false
      }
        const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/userapp/cart/list`,obj,{
          method: "post",
          headers: { 
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
          }
        });
        
          if(response.data.status==='SUCCESS')
          return response.data;
          else
           return false;
      } 

      async updateCart(data,id){
        const response = await axios.put(`${process.env.NEXT_PUBLIC_HOST}/userapp/cart/update/${id}`,data,{
          method: "put",
          headers: { 
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
          }
        });
          if(response.data.status==='SUCCESS')
          return response.data;
          else
           return false;
      }

    async deleteCart(id){
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_HOST}/userapp/cart/delete/${id}`,{
        method: "delete",
        headers: { 
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
        if(response.data.status==='SUCCESS')
        return response.data;
        else
         return false;
    } 

    async deleteMany(ids){

      let obj = {ids}
      
      const response = await axios.put(`${process.env.NEXT_PUBLIC_HOST}/userapp/cart/softDeleteMany`,obj,{
        method: "put",
        headers: { 
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
        if(response.data.status==='SUCCESS')
        return response.data;
        else
         return false;
    } 
   

}

export const cartApi = new CartApi();
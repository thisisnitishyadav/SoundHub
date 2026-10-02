import axios from "axios";


class OrderApi{

   

    async createOrder(data){
   
        const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/userapp/order/create`,data,{
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


      async getOrder(page,limit,filters){
             let obj ={
          "query":filters,
          "options": {
          "collation": "",
          "sort": {"createdAt":-1},
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
        const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/userapp/order/list`,obj,{
          method: "post",
          headers: { 
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
          }
        });
        
          if(response.data.status==='SUCCESS')
          return response.data;
          else
           return response.data;
      } 

      async updateOrder(data,id){
        const response = await axios.put(`${process.env.NEXT_PUBLIC_HOST}/userapp/order/update/${id}`,data,{
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

      async getSignleOrder(id){
        let obj = {
          "query": { "_id": id },
          "options": {
            "populate": "products.productId",
            "page": 1,
            "limit": 1,
            "pagination": false
          },
          "isCountOnly": false
        };
        const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/userapp/order/list`, obj, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
          }
        });
        if (response.data.status === 'SUCCESS') {
          const orders = response.data.data?.data || [];
          return { status: 'SUCCESS', data: orders[0] || null };
        }
        return false;
      }

    async deleteOrder(id){
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_HOST}/userapp/order/delete/${id}`,{
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

 
   

}

export const orderApi = new OrderApi();
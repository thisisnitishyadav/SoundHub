import privateRequest from "../requestMethod";


class CartApi{


    async createCart(data){

        const response = await privateRequest.post('/cart/create', data);
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
        const response = await privateRequest.post('/cart/list', obj);

          if(response.data.status==='SUCCESS')
          return response.data;
          else
           return false;
      }

      async updateCart(data,id){
        const response = await privateRequest.put(`/cart/update/${id}`, data);
          if(response.data.status==='SUCCESS')
          return response.data;
          else
           return false;
      }

    async deleteCart(id){
      const response = await privateRequest.delete(`/cart/delete/${id}`);
        if(response.data.status==='SUCCESS')
        return response.data;
        else
         return false;
    }

    async deleteMany(ids){

      let obj = {ids}

      const response = await privateRequest.put('/cart/softDeleteMany', obj);
        if(response.data.status==='SUCCESS')
        return response.data;
        else
         return false;
    }


}

export const cartApi = new CartApi();

import privateRequest from "../requestMethod";


class OrderApi{



    async createOrder(data){

        const response = await privateRequest.post('/order/create', data);
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
        const response = await privateRequest.post('/order/list', obj);

          if(response.data.status==='SUCCESS')
          return response.data;
          else
           return response.data;
      }

      async updateOrder(data,id){
        const response = await privateRequest.put(`/order/update/${id}`, data);
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
        const response = await privateRequest.post('/order/list', obj);
        if (response.data.status === 'SUCCESS') {
          const orders = response.data.data?.data || [];
          return { status: 'SUCCESS', data: orders[0] || null };
        }
        return false;
      }

    async deleteOrder(id){
      const response = await privateRequest.delete(`/order/delete/${id}`);
        if(response.data.status==='SUCCESS')
        return response.data;
        else
         return false;
    }




}

export const orderApi = new OrderApi();

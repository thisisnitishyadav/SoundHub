import axios from "axios";
import privateRequest from "../requestMethod";

class ProductApi{

    async getProduct(id){
       const response = await privateRequest.get(`/product/get/${id}`);
       if(response.data.status==='SUCCESS')
       return response.data;
       else
        return false;
    }

    async getProducts(page,limit,filters){
        let obj ={
              "query":filters,
              "options": {
              "collation": "",
              "sort":"",
              "populate": "",
              "projection": "",
              "lean": false,
              "leanWithId": true,
              "page": page,
              "limit": 9,
              "pagination": true,
              "useEstimatedCount": false,
              "useCustomCountFn": false,
              "forceCountFn": false,
              "read": {},
              "options": {}
            },
            "isCountOnly": false
          }
        const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/userapp/product/list`,obj);
        if(response.data.status==='SUCCESS')
        return response.data;
        else
         return false;
     }


    async deleteProduct(id){
      const response = await privateRequest.delete(`/product/delete/${id}`);
        if(response.data.status==='SUCCESS')
        return response.data;
        else
         return false;
    }


}

export const productApi = new ProductApi();

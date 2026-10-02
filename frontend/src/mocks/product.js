import axios from "axios";

class ProductApi{

    async getProduct(id){
       const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/userapp/product/get/${id}`,{
        method: "get",
        headers: { 
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
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
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_HOST}/userapp/product/delete/${id}`,{
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

export const productApi = new ProductApi();
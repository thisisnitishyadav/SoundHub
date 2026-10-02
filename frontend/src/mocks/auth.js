import axios from "axios";


class AuthApi{
    async signup(data){
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/userapp/auth/register`, data);
            
            if (res) {
                return res;
            } else {
                alert('no');
                return false;
            }
        } catch (error) {
            alert(error);
        }
    }


    async login(data){
        try {
             const res = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/userapp/auth/login`, data);
            if(res){
                return res.data
            }else{
                alert('n1');
                return false
            }
        } catch (error) {
          alert(error);
        }
    }

    
    async getUser(){

    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/userapp/user/me`,{
            method:'get',
            headers:{
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
            }
            
        })

        if(res?.data?.status === "SUCCESS"){
            return res.data
        }else{
            return false
        }
    } catch (error) {
      console.log(error);  
    }
   }

    async updateUser(data,id){
     const response = await axios.put(`${process.env.NEXT_PUBLIC_HOST}/userapp/user/update/${id}`,data,{
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

    async deleteUser(id){
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_HOST}/userapp/user/delete/${id}`,{
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


export const authApi = new AuthApi();
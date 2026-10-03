import axios from "axios";
import privateRequest from "../requestMethod";


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
        const res = await privateRequest.get('/user/me');

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
     const response = await privateRequest.put(`/user/update/${id}`, data);
      if(response.data.status==='SUCCESS')
      return response.data;
      else
       return false;
  }

    async deleteUser(id){
      const response = await privateRequest.delete(`/user/delete/${id}`);
      if(response.data.status==='SUCCESS')
      return response.data;
      else
       return false;
    }

  async sendResetPasswordOtp(data) {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/userapp/auth/reset-password-otp`, data);
      return res.data;
    } catch (error) {
      return { status: 'FAILURE', message: error?.response?.data?.message || error.message };
    }
  }

  async validateOtp(data) {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/userapp/auth/validate-otp`, data);
      return res.data;
    } catch (error) {
      return { status: 'FAILURE', message: error?.response?.data?.message || error.message };
    }
  }

  async resetPassword(data) {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_HOST}/userapp/auth/reset-password`, data);
      return res.data;
    } catch (error) {
      return { status: 'FAILURE', message: error?.response?.data?.message || error.message };
    }
  }
}


export const authApi = new AuthApi();

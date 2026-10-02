import axios from 'axios';

const BASE_URL = `${process.env.NEXT_PUBLIC_HOST}/userapp`;

let privateRequest;

export const publicRequest = axios.create({
    baseURL: BASE_URL
})


try {

 privateRequest = axios.create({
    baseURL: BASE_URL,
    headers:{Authorization:`Bearer ${localStorage.getItem("accessToken")}`}
})
    
} catch (error) {
    
}

export default privateRequest;
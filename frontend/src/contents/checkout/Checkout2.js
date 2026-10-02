'use client'
import axios from 'axios'
import React from 'react'
import Confirmation from './Confirmation'
import Script from 'next/script'
import { Box, Button, Dialog, Typography } from '@mui/material'
import { useDispatch } from '@/redux/store/store'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { deleteMany } from '@/redux/slices/cart'
import { createOrder } from '@/redux/slices/order'
import PaymentIcon from '@mui/icons-material/Payment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const Checkout2 = ({total, address, setOpen}) => {

  const user= useSelector((state)=>state.auth);
  const {carts}= useSelector ((state)=>state.cart);
  const dispatch =useDispatch();
  const [show,setShow]=useState(false);

  const handleClearAll = async() => {
    let ids=[]
    for(let k of carts)
    ids.push(k.id);
      await dispatch(deleteMany(ids))
    }

    const handleClick = async() => {
      let products=carts.map((cart)=>{
        return{
          'productId':cart.products[0].productId,
          'qty':cart.products[0].qty
        }
      })

      let data={
        userId:user.id,
        products,
        address,
        status:'pending'
      }

      const result = await dispatch(createOrder(data));
      setShow(true)
      if(result){
    }
      else
      alert('some error occured')
    }

    const handleClose = () => {
      setShow(false)
  }

  const totalPrice = ((total)*100)

  const handlePay = async () =>{
  const option = {
    amount : '100000',
    currency : 'INR'
  }

  const {data} = await axios.post('https://boat-clone-backend.onrender.com/userapp/payment/checkout',option, {
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
});

if(data.status==='SUCCESS'){
  alert("You will redirect to Payment Gateway")
     handleClearAll()
   }
   else
    return false;

  const options = {
    key:process.env.NEXT_PUBLIC_RAZORPAY_API_ID,
    "amount": data.order.amount,
    "currency": "INR",
    "name": 'Nitish Yadav',
    "description": "Test Transaction",
    "image": "https://avatars.githubusercontent.com/u/101405119?v=4",
    "order_id": data.order.id,
    "callback_url": "http://localhost:5001/userapp/payment/paymentVerify",
    "prefill": {
        "name":user.name,
        "email":user.email,
        "contact":user.phone
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    }
};
   var rzp1 = new window.Razorpay(options);
    rzp1.open();
}

  return (
    <>
     <Dialog open={show} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
  <Confirmation />
</Dialog>
<Script src="https://checkout.razorpay.com/v1/checkout.js "></Script>

<Box sx={{ width: { xs: '100%', sm: '420px' }, display: 'flex', flexDirection: 'column', gap: '16px', p: { xs: 3, sm: 4 } }}>
  <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#111827', textAlign: 'center', mb: 1 }}>Choose Payment Method</Typography>

  <Box sx={{ border: '1px solid #e5e7eb', borderRadius: '12px', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, cursor: 'pointer', '&:hover': { borderColor: '#111827', backgroundColor: '#f9fafb' }, transition: 'all 0.2s' }} onClick={handlePay}>
    <PaymentIcon sx={{ fontSize: 32, color: '#6366f1' }} />
    <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>Pay Online</Typography>
    <Typography sx={{ fontSize: '12px', color: '#9ca3af' }}>UPI, Cards, Net Banking</Typography>
  </Box>

  <Box sx={{ border: '1px solid #e5e7eb', borderRadius: '12px', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, cursor: 'pointer', '&:hover': { borderColor: '#111827', backgroundColor: '#f9fafb' }, transition: 'all 0.2s' }} onClick={handleClick}>
    <LocalShippingIcon sx={{ fontSize: 32, color: '#f59e0b' }} />
    <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>Cash On Delivery</Typography>
    <Typography sx={{ fontSize: '12px', color: '#9ca3af' }}>Pay when you receive</Typography>
  </Box>
</Box>

     </>
  )
}

export default Checkout2

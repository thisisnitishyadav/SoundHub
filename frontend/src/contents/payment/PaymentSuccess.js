'use client'
import { getOrder, updateOrder } from '@/redux/slices/order';
import { useDispatch, useSelector } from '@/redux/store/store';
import { Box, Button, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useState } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const PaymentSuccess = () => {
  const router = useRouter();

  return (
    <div className='bg-gradient-to-br from-green-50 to-gray-50 min-h-[80vh] flex items-center justify-center px-4'>
      <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',gap:'24px',backgroundColor:'white',borderRadius:'24px',p:{xs:4,md:6},maxWidth:'450px',width:'100%',boxShadow:'0 4px 24px rgba(0,0,0,0.08)'}}>
        <Box sx={{backgroundColor:'#f0fdf4',borderRadius:'50%',p:3,display:'flex'}}>
          <CheckCircleOutlineIcon sx={{fontSize:48,color:'#22c55e'}} />
        </Box>
        <Typography sx={{fontSize:{xs:'20px',md:'24px'},fontWeight:'700',color:'#111827',textAlign:'center'}}>Payment Successful!</Typography>
        <Typography sx={{fontSize:'14px',color:'#6b7280',textAlign:'center'}}>Your order has been placed. Thank you for shopping with us!</Typography>
        <Button onClick={() => router.push('/')} variant='contained'
          sx={{width:'100%',backgroundColor:'#16a34a','&:hover':{backgroundColor:'#15803d'},borderRadius:'12px',py:1.5,textTransform:'none',fontSize:'15px',fontWeight:600}}>
          Continue Shopping
        </Button>
        <Button onClick={() => router.push('/orders')} variant='text'
          sx={{color:'#6b7280','&:hover':{color:'#111827',backgroundColor:'transparent'},textTransform:'none',fontSize:'14px'}}>
          View Orders
        </Button>
      </Box>
    </div>
  )
}

export default PaymentSuccess

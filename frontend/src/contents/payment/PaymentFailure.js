'use client'
import { Box, Button, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React from 'react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const PaymentFailure = () => {
    const router = useRouter();

  return (
    <div className='bg-gradient-to-br from-red-50 to-gray-50 min-h-[80vh] flex items-center justify-center px-4'>
      <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',gap:'24px',backgroundColor:'white',borderRadius:'24px',p:{xs:4,md:6},maxWidth:'450px',width:'100%',boxShadow:'0 4px 24px rgba(0,0,0,0.08)'}}>
        <Box sx={{backgroundColor:'#fef2f2',borderRadius:'50%',p:3,display:'flex'}}>
          <ErrorOutlineIcon sx={{fontSize:48,color:'#ef4444'}} />
        </Box>
        <Typography sx={{fontSize:{xs:'20px',md:'24px'},fontWeight:'700',color:'#111827',textAlign:'center'}}>Payment Failed</Typography>
        <Typography sx={{fontSize:'14px',color:'#6b7280',textAlign:'center'}}>Something went wrong with your payment. Please try again.</Typography>
        <Button onClick={() => router.push('/')} variant='contained'
          sx={{width:'100%',backgroundColor:'#111827','&:hover':{backgroundColor:'#1f2937'},borderRadius:'12px',py:1.5,textTransform:'none',fontSize:'15px',fontWeight:600}}>
          Continue Shopping
        </Button>
      </Box>
    </div>
  )
}

export default PaymentFailure

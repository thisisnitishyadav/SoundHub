'use client'
import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from '@/redux/store/store'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Confirmation = () => {
  const router=useRouter();
  const dispatch =useDispatch();

  const handleOrderDetail=()=>{
   router.push('/orders')
  }
  return (
    <Box
  sx={{
    width: { xs: '100%', sm: '420px' },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    p: { xs: 3, sm: 4 },
    textAlign: 'center',
  }}
>
  <CheckCircleOutlineIcon sx={{ fontSize: 56, color: '#22c55e' }} />
  <Typography sx={{ fontSize: { xs: '18px', sm: '22px' }, fontWeight: 700, color: '#111827' }}>
    Order Placed Successfully!
  </Typography>
  <Typography sx={{ fontSize: '14px', color: '#6b7280' }}>
    Thank you for your purchase. Your order is being processed.
  </Typography>
  <Button
    onClick={() => handleOrderDetail()}
    variant="contained"
    sx={{
      backgroundColor: '#111827', '&:hover': { backgroundColor: '#1f2937' },
      borderRadius: '10px', px: 4, py: 1.2,
      textTransform: 'none', fontSize: '14px', fontWeight: 600, mt: 1,
    }}
  >
    Check Order Status
  </Button>
</Box>
  )
}

export default Confirmation

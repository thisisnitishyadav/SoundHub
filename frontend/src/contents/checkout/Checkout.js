'use client'
import React, { useState } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Button,Box, Checkbox,Stack, FormControlLabel, FormGroup, TextField, Dialog } from '@mui/material';
import { useSelector,useDispatch } from '@/redux/store/store';
import { useFormik } from 'formik';
import { createOrder } from '@/redux/slices/order';
import { getUser,updateUser } from '@/redux/slices/auth';
import { useEffect } from 'react';
import Checkout2 from './Checkout2';
import { readCart } from '@/redux/slices/cart';
import { useRouter } from 'next/navigation';
import SecurityIcon from '@mui/icons-material/Security';

const initialValues ={
  locality:"",
  city:"",
  state:"",
  zipcode:""
}

const Checkout = () => {
  const router =useRouter
  const dispatch =useDispatch();
  const {carts}= useSelector ((state)=>state.cart);
  const {user} =useSelector((state)=>state.auth);
  const orders=useSelector ((state)=>state.order);
  const [addressDetail,setAddressDetail]=useState({});
  const [open ,setOpen]=useState();
  const [close,setClose]=useState();
  let address = (user && user?.address)

  const fetchUser =async ()=>{
    let result =await dispatch(getUser(1,10))
    if (result) return true
    else return false
  }

  const fetchCarts = async() => {
    let result = await dispatch(readCart())
    if(result) return true
  }

  const {values, errors, handleBlur, handleChange ,handleSubmit}=useFormik({
    initialValues:initialValues,
    onSubmit : async (values,action) =>{
      let address={address:[values]}
      if(address) alert("Address Saved Successfully");
      const result =await dispatch(updateUser(address,user.id))
      if(result){
        action.resetForm();
        setClose(false);
      }
    }
  });

  const handleOpen =()=>{ setOpen(true); }
  const handleOpenDrawer=()=>{ setClose(true); }
  const handleClose=()=>{}
  const handleCloseDrawer=()=>{ setClose(false); }

  let mrp=0;
  let cost=0;
  for(let cart of carts){
    for (let product of cart.products){
        mrp+=(product.productId.price.mrp)
        cost+=(product.productId.price.cost)
    }
  }
  let discount =((mrp)-(cost))
  let total =(cost)

  useEffect(()=>{
    fetchUser()
    fetchCarts()
  },[])

  return (
    <div className='bg-gray-50 min-h-screen py-6 md:py-10'>
      <div className='max-w-4xl mx-auto px-4 md:px-8'>
        <h1 className='text-2xl font-bold text-gray-900 mb-6'>Checkout</h1>
      <div className='flex flex-col md:flex-row gap-6'>

       <div className='flex-1 space-y-4'>

          <Accordion className='rounded-xl shadow-sm' sx={{ borderRadius: '12px !important', '&:before': { display: 'none' }, overflow: 'hidden' }}>
            <AccordionSummary expandIcon={<ArrowDownwardIcon />}>
              <Typography sx={{ fontWeight: 600, color: '#111827' }}>1. Login or Signup</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className='space-y-3'>
              <TextField id="standard-basic" label="Enter Email ID or Phone No." variant="outlined" fullWidth size="small" />
              <Button variant="contained" sx={{ backgroundColor: '#111827', '&:hover': { backgroundColor: '#1f2937' }, borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}>Continue</Button>
              </div>
            </AccordionDetails>
          </Accordion>

        <form onSubmit={handleSubmit}>
          <Accordion className='rounded-xl shadow-sm' sx={{ borderRadius: '12px !important', '&:before': { display: 'none' }, overflow: 'hidden' }}>
                <AccordionSummary expandIcon={<ArrowDownwardIcon />}>
                  <Typography sx={{ fontWeight: 600, color: '#111827' }}>2. Delivery Address</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className='space-y-3'>
                    <div className='flex flex-col sm:flex-row gap-3'>
                  <TextField required label="Name" variant="outlined" name='name' onChange={handleChange} value={user && user.firstName} fullWidth size="small" />
                  <TextField required label="Mobile Number" name='phone' variant="outlined" onChange={handleChange} value={user && user.phone} fullWidth size="small" />
                  <Button variant="outlined" onClick={handleOpenDrawer} sx={{ borderRadius: '8px', textTransform: 'none', minWidth: 'auto' }}>Change</Button>
                  </div>
                  <div className='flex flex-col sm:flex-row gap-3'>
                  <TextField required label="Pincode" type="number" name='zipcode' InputLabelProps={{ shrink: true }} onChange={handleChange} onBlur={handleBlur} value={values.zipcode} fullWidth size="small" />
                  <TextField label="Locality" variant="outlined" name='locality' fullWidth size="small" />
                  </div>
                  <TextField required label="Address (Area or Street)" multiline maxRows={4} fullWidth name='locality' onChange={handleChange} value={values.locality} size="small" />
                    <div className='flex flex-col sm:flex-row gap-3'>
                      <TextField required label="District" defaultValue="Haridwar" name='city' onChange={handleChange} onBlur={handleBlur} value={values.city} fullWidth size="small" />
                      <TextField required label="State" variant="outlined" name='state' onChange={handleChange} onBlur={handleBlur} value={values.state} fullWidth size="small" />
                    </div>
                    <div className='flex flex-col sm:flex-row gap-3'>
                      <TextField label="Landmark (Optional)" variant="outlined" fullWidth size="small" />
                      <TextField label="Alternate Phone" variant="outlined" fullWidth size="small" />
                    </div>
                  <div className='flex gap-3 pt-2'>
                  <Button variant="contained" type='submit' sx={{ backgroundColor: '#111827', '&:hover': { backgroundColor: '#1f2937' }, borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}>Save & Deliver Here</Button>
                  <Button variant="text" onClick={handleCloseDrawer} sx={{ textTransform: 'none', color: '#6b7280' }}>Cancel</Button>
                  </div>
                    </div>
                </AccordionDetails>
              </Accordion>
            </form>

          <Accordion className='rounded-xl shadow-sm' sx={{ borderRadius: '12px !important', '&:before': { display: 'none' }, overflow: 'hidden' }}>
            <AccordionSummary expandIcon={<ArrowDownwardIcon />}>
              <Typography sx={{ fontWeight: 600, color: '#111827' }}>3. Payment Options</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                 <FormControlLabel control={<Checkbox defaultChecked />} label="UPI" />
                 <FormControlLabel control={<Checkbox />} label="Credit / Debit / ATM Card" />
                 <FormControlLabel control={<Checkbox />} label="Net Banking" />
                 <FormControlLabel control={<Checkbox />} label="Cash On Delivery" />
                 <Box sx={{display:Object.keys({address}).length !== 0 ? 'block' :'none', mt: 2}}>
                 <Button onClick={handleOpen} variant='contained' fullWidth
                   sx={{backgroundColor:'#111827','&:hover':{backgroundColor:'#1f2937'},borderRadius:'10px',textTransform:'none',fontWeight:600,py:1.2}}>
                   Proceed to Payment
                 </Button>
                 <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: '16px' } }}>
                   <Checkout2 setOpen={setOpen} address={address} total={total} />
                 </Dialog>
                  </Box>
              </FormGroup>
            </AccordionDetails>
          </Accordion>

       </div>

       <div className='md:w-64'>
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-start gap-3'>
          <SecurityIcon sx={{ color: '#22c55e', fontSize: 28, mt: 0.3 }} />
          <div>
            <p className='text-sm font-semibold text-gray-900'>Safe & Secure</p>
            <p className='text-xs text-gray-500 mt-0.5'>100% secure payments. Easy returns.</p>
          </div>
        </div>
       </div>
      </div>
      </div>
    </div>
  )
}

export default Checkout;

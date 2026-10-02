'use client'
import { getUser, logoutUser, updateUser } from '@/redux/slices/auth'
import { Avatar, Box, Button, Divider, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import LogoutIcon from '@mui/icons-material/Logout';

const initialValues = {
    phone:"", name:"", lastName:"", email:"", password:"", date:"", sex:"",
};

const MyAccount = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const handleLogout = async () => {
          localStorage.removeItem('accessToken');
          await dispatch(logoutUser())
          router.push('/signup')
    }

    const fetchUser = async() =>{
        let result = await dispatch(getUser())
        if(result) console.log(user)
    }
    useEffect(()=>{ fetchUser() },[dispatch])

    const {values, handleBlur,handleChange,handleSubmit} = useFormik({
        initialValues: initialValues,
        onSubmit : async (values,action) =>{
          const {firstName, lastName, sex, date} = values;
          let data = {firstName, lastName, sex, date}
          const result = await dispatch(updateUser(data,user.id));
          if(result) router.push("/");
        },
    });

    const sidebarItems = [
      { label: 'Profile', icon: <PersonIcon sx={{ fontSize: 18 }} />, active: true },
      { label: 'Orders', icon: <ShoppingBagIcon sx={{ fontSize: 18 }} />, onClick: () => router.push('/orders') },
      { label: 'Wishlist', icon: <FavoriteIcon sx={{ fontSize: 18 }} /> },
      { label: 'Saved Address', icon: <LocationOnIcon sx={{ fontSize: 18 }} /> },
      { label: 'Contact Us', icon: <HeadsetMicIcon sx={{ fontSize: 18 }} /> },
    ];

  return (
    <div className='bg-gray-50 min-h-screen'>
     <Box sx={{maxWidth:'1100px',mx:'auto',px:{xs:2,md:4},py:{xs:3,md:5}}}>
        <Typography sx={{fontSize:'24px',fontWeight:700,color:'#111827',mb:3}}>My Account</Typography>
        <Box sx={{display:'flex',flexDirection:{xs:'column',md:'row'},gap:3}}>

        <Box sx={{flexDirection:'column',width:{xs:'100%',md:'280px'},backgroundColor:'white',borderRadius:'16px',boxShadow:'0 1px 3px rgba(0,0,0,0.08)',overflow:'hidden',display:{xs:'none',md:'flex'}}}>
          <Box sx={{p:2.5,display:'flex',gap:2,alignItems:'center',background:'linear-gradient(135deg,#111827,#1f2937)'}}>
            <Avatar sx={{width:44,height:44,backgroundColor:'#374151'}} />
            <Box>
              <Typography sx={{color:'white',fontWeight:600,fontSize:'15px'}}>{user.name} {user.lastName}</Typography>
              <Typography sx={{color:'#9ca3af',fontSize:'12px'}}>{user.email}</Typography>
            </Box>
          </Box>
          {sidebarItems.map((item, i) => (
            <Box key={i} onClick={item.onClick} sx={{display:'flex',alignItems:'center',gap:1.5,px:2.5,py:1.8,cursor:'pointer','&:hover':{backgroundColor:'#f9fafb'},borderBottom:'1px solid #f3f4f6',transition:'background-color 0.15s'}}>
              <Box sx={{color: item.active ? '#111827' : '#9ca3af'}}>{item.icon}</Box>
              <Typography sx={{fontSize:'14px',fontWeight: item.active ? 600 : 400,color: item.active ? '#111827' : '#4b5563'}}>{item.label}</Typography>
            </Box>
          ))}
          <Box onClick={handleLogout} sx={{display:'flex',alignItems:'center',gap:1.5,px:2.5,py:1.8,cursor:'pointer','&:hover':{backgroundColor:'#fef2f2'},transition:'background-color 0.15s'}}>
            <LogoutIcon sx={{fontSize:18,color:'#ef4444'}} />
            <Typography sx={{fontSize:'14px',color:'#ef4444',fontWeight:500}}>Logout</Typography>
          </Box>
        </Box>

        <Box sx={{display:{xs:'flex',md:'none'},gap:1,flexWrap:'wrap'}}>
          <Button size="small" onClick={() => router.push('/orders')} sx={{borderRadius:'20px',textTransform:'none',backgroundColor:'#f3f4f6',color:'#374151','&:hover':{backgroundColor:'#e5e7eb'}}}>Orders</Button>
          <Button size="small" sx={{borderRadius:'20px',textTransform:'none',backgroundColor:'#f3f4f6',color:'#374151','&:hover':{backgroundColor:'#e5e7eb'}}}>Wishlist</Button>
          <Button size="small" sx={{borderRadius:'20px',textTransform:'none',backgroundColor:'#f3f4f6',color:'#374151','&:hover':{backgroundColor:'#e5e7eb'}}}>Address</Button>
          <Button size="small" onClick={handleLogout} sx={{borderRadius:'20px',textTransform:'none',backgroundColor:'#fef2f2',color:'#ef4444','&:hover':{backgroundColor:'#fee2e2'}}}>Logout</Button>
        </Box>

        <Box sx={{flex:1,backgroundColor:'white',borderRadius:'16px',boxShadow:'0 1px 3px rgba(0,0,0,0.08)',overflow:'hidden'}}>
          <form onSubmit={handleSubmit} autoComplete="off" style={{width:'100%',display:'flex',flexDirection:'column'}}>
            <Box sx={{px:3,py:2.5,background:'linear-gradient(135deg,#111827,#1f2937)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <Typography sx={{color:'white',fontWeight:600,fontSize:'15px'}}>Edit Profile</Typography>
              <Typography sx={{color:'#60a5fa',fontSize:'12px',cursor:'pointer','&:hover':{color:'#93bbfd'}}}>Change Password</Typography>
            </Box>
            <Box sx={{p:3,display:'flex',flexDirection:'column',gap:2.5}}>
              <TextField variant='outlined' label='Email' type='email' name='email' value={user.email} onChange={handleChange} onBlur={handleBlur} size="small" fullWidth />
              <Box sx={{display:'flex',flexDirection:{xs:'column',sm:'row'},gap:2}}>
                <TextField variant='outlined' label='First Name' type='text' name='firstName' value={values.name} onChange={handleChange} onBlur={handleBlur} size="small" fullWidth />
                <TextField variant='outlined' label='Last Name' type='text' name='lastName' value={values.lastName} onChange={handleChange} onBlur={handleBlur} size="small" fullWidth />
              </Box>
              <Box sx={{display:'flex',flexDirection:{xs:'column',sm:'row'},gap:2}}>
                <TextField variant='outlined' type='date' name='date' value={values.date} onChange={handleChange} onBlur={handleBlur} size="small" fullWidth InputLabelProps={{shrink:true}} label="Date of Birth" />
                <TextField variant='outlined' label='Phone' type='number' name='phone' value={user.phone} onChange={handleChange} onBlur={handleBlur} size="small" fullWidth />
              </Box>
              <TextField variant='outlined' label='Gender' type='text' name='sex' value={values.sex} onChange={handleChange} onBlur={handleBlur} size="small" sx={{width:{xs:'100%',sm:'50%'}}} />
              <Button type='submit' variant='contained' sx={{backgroundColor:'#111827','&:hover':{backgroundColor:'#1f2937'},borderRadius:'10px',textTransform:'none',fontWeight:600,alignSelf:'flex-start',px:4}}>Save Changes</Button>
            </Box>
          </form>
        </Box>
        </Box>
     </Box>
    </div>
  )
}

export default MyAccount

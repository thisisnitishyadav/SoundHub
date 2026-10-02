'use client'
import { getUser, logoutUser } from '@/redux/slices/auth'
import { Avatar, Box, Button, Divider, Step, StepLabel, Stepper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useParams } from 'next/navigation'
import dayjs from 'dayjs'
import { getSingleOrder } from '@/redux/slices/order'
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import LogoutIcon from '@mui/icons-material/Logout';

const OrderDetail = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const {singleOrder, orders} = useSelector((state) => state.order);
    const [orderDetail, setOrderDetail] = useState({})
    const params = useParams()

    const handleLogout = async () => {
        localStorage.removeItem('accessToken');
        await dispatch(logoutUser())
        router.push('/login')
    }

    const fetchUser = async() => { await dispatch(getUser()) }
    const fetchOrder = async() => { await dispatch(getSingleOrder(params?.orderId)) }

    useEffect(()=>{ fetchUser(); fetchOrder() },[dispatch])

    const steps = [
      { status:"Order Confirmed", date: orderDetail?.orderStatus?.orderConfirm?.date },
      { status:"Shipped", date: orderDetail?.orderStatus?.shipped?.date },
      { status:"Out for Delivery", date: orderDetail?.orderStatus?.outForDelivery?.date },
      { status:"Delivered", date: orderDetail?.orderStatus?.delivered?.date }
    ];

    let activeSteps = ()=>{
      if(orderDetail.orderStatus){
        if(orderDetail.orderStatus.delivered?.isConfirmed) return 4;
        else if(orderDetail.orderStatus.outForDelivery?.isConfirmed) return 3;
        else if(orderDetail.orderStatus.shipped?.isConfirmed) return 2;
        else if(orderDetail.orderStatus.orderConfirm?.isConfirmed) return 1;
        else return 0;
      }
    }

    let mrp = 0, cost = 0;
    for(let order of orders){
      for(let product of order.products){
        mrp += (product.productId?.price?.mrp || 0)
        cost += (product.productId?.price?.cost || 0)
      }
    }
    let discount = mrp - cost;
    let total = cost;

    const sidebarItems = [
      { label: 'Profile', icon: <PersonIcon sx={{ fontSize: 18 }} />, onClick: () => router.push('/myAccount') },
      { label: 'Orders', icon: <ShoppingBagIcon sx={{ fontSize: 18 }} />, onClick: () => router.push('/orders'), active: true },
      { label: 'Wishlist', icon: <FavoriteIcon sx={{ fontSize: 18 }} /> },
      { label: 'Saved Address', icon: <LocationOnIcon sx={{ fontSize: 18 }} /> },
      { label: 'Contact Us', icon: <HeadsetMicIcon sx={{ fontSize: 18 }} /> },
    ];

  return (
    <div className='bg-gray-50 min-h-screen'>
    <Box sx={{maxWidth:'1100px',mx:'auto',px:{xs:2,md:4},py:{xs:3,md:5}}}>
      <Typography sx={{fontSize:'24px',fontWeight:700,color:'#111827',mb:3}}>Order Details</Typography>
      <Box sx={{display:'flex',flexDirection:{xs:'column',md:'row'},gap:3}}>

      <Box sx={{flexDirection:'column',width:'280px',backgroundColor:'white',borderRadius:'16px',boxShadow:'0 1px 3px rgba(0,0,0,0.08)',overflow:'hidden',display:{xs:'none',md:'flex'},height:'fit-content'}}>
        <Box sx={{p:2.5,display:'flex',gap:2,alignItems:'center',background:'linear-gradient(135deg,#111827,#1f2937)'}}>
          <Avatar sx={{width:44,height:44,backgroundColor:'#374151'}} />
          <Box>
            <Typography sx={{color:'white',fontWeight:600,fontSize:'15px'}}>{user.name}</Typography>
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

      <Box sx={{flex:1,display:'flex',flexDirection:'column',gap:2.5}}>

        <Box sx={{backgroundColor:'white',borderRadius:'16px',boxShadow:'0 1px 3px rgba(0,0,0,0.08)',overflow:'hidden'}}>
          <Box sx={{display:'flex',flexDirection:{xs:'column',sm:'row'},gap:3,p:3}}>
            <img src='https://cdn.shopify.com/s/files/1/0057/8938/4802/files/131_f04f74fd-45d4-4614-85cf-6ccf69c4cf90.jpg?v=1691395049' style={{width:'130px',height:'170px',objectFit:'cover',borderRadius:'12px'}} />
            <Box sx={{flex:1}}>
              <Typography sx={{fontSize:'16px',fontWeight:600,color:'#111827'}}>
                Wireless Earbud {orderDetail?.productId?.title?.shortTitle}
              </Typography>
              <Typography sx={{fontSize:'14px',color:'#6b7280',mt:0.5}}>
                Airdopes 131 {orderDetail?.productId?.title?.longTitle}
              </Typography>
              <Typography sx={{fontSize:'20px',fontWeight:700,color:'#111827',mt:1}}>
                ₹1999 {orderDetail?.productId?.price?.cost}
              </Typography>
            </Box>
            <Box sx={{display:'flex',alignItems:{xs:'stretch',sm:'flex-start'}}}>
              <Button variant='outlined' size="small" sx={{borderRadius:'8px',textTransform:'none',borderColor:'#fecaca',color:'#ef4444','&:hover':{borderColor:'#ef4444',backgroundColor:'#fef2f2'},fontSize:'13px',whiteSpace:'nowrap'}}>Cancel Order</Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{backgroundColor:'white',borderRadius:'16px',boxShadow:'0 1px 3px rgba(0,0,0,0.08)',p:3}}>
          <Typography sx={{fontWeight:600,fontSize:'16px',color:'#111827',mb:1.5}}>Shipping Details</Typography>
          <Box sx={{display:'flex',gap:1}}>
            <Typography sx={{fontSize:'14px',fontWeight:500,color:'#374151'}}>{user.name} {user.lastName}</Typography>
          </Box>
          <Typography sx={{fontSize:'13px',color:'#6b7280',mt:0.5}}>Locality: BTM Layout {orders[0]?.address?.locality}</Typography>
          <Typography sx={{fontSize:'13px',color:'#6b7280'}}>City: Bangalore {orders[0]?.address?.city}</Typography>
          <Typography sx={{fontSize:'13px',color:'#6b7280'}}>Pincode: 560029 {orders[0]?.address?.state} {orders[0]?.address?.zipcode}</Typography>
          <Typography sx={{fontSize:'13px',color:'#6b7280'}}>Phone: 9129842706 {user.phone}</Typography>
        </Box>

        <Box sx={{display:'flex',gap:2.5,flexDirection:{xs:'column',sm:'row'}}}>
          <Box sx={{flex:1,backgroundColor:'white',borderRadius:'16px',boxShadow:'0 1px 3px rgba(0,0,0,0.08)',p:3}}>
            <Typography sx={{fontWeight:600,fontSize:'16px',color:'#111827',mb:2}}>Price Details</Typography>
            {[
              ['Total Items', '1'],
              ['Total MRP', `₹${mrp}`],
              ['Discount', `- ₹${discount}`],
              ['GST', '₹gst'],
            ].map(([label, val]) => (
              <Box key={label} sx={{display:'flex',justifyContent:'space-between',py:0.5}}>
                <Typography sx={{fontSize:'13px',color:'#6b7280'}}>{label}</Typography>
                <Typography sx={{fontSize:'13px',color: label === 'Discount' ? '#22c55e' : '#374151',fontWeight:500}}>{val}</Typography>
              </Box>
            ))}
            <Divider sx={{my:1.5}} />
            <Box sx={{display:'flex',justifyContent:'space-between'}}>
              <Typography sx={{fontSize:'14px',fontWeight:700,color:'#111827'}}>Total</Typography>
              <Typography sx={{fontSize:'14px',fontWeight:700,color:'#111827'}}>₹{total}</Typography>
            </Box>
          </Box>

          <Box sx={{flex:1,backgroundColor:'white',borderRadius:'16px',boxShadow:'0 1px 3px rgba(0,0,0,0.08)',p:3}}>
            <Typography sx={{fontWeight:600,fontSize:'16px',color:'#111827',mb:2}}>Order Status</Typography>
            <Stepper activeStep={activeSteps()} orientation='vertical'>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label.status}</StepLabel>
                  <Typography sx={{fontSize:'11px',color:'#9ca3af',ml:4}}>{label.date && dayjs(label.date).format('DD MMM YYYY')}</Typography>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Box>
      </Box>

      </Box>
    </Box>
    </div>
  )
}

export default OrderDetail;

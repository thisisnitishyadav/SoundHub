'use client'
import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

import { styled } from '@mui/material';
import HomeSlider from './HomeSlider';

const SliderContainer = styled('div')({
  width:"100%",
  height:"500px",
  display: "flex",
  justifyContent:'center',
  alignItems:'center',
  overflow:"hidden",
  position:'relative',
  "@media (max-width: 900px)": {
    height:"350px",
  },
  "@media (max-width: 600px)": {
    height:"280px",
  },
})

const SliderInnerContainer = styled('div')({
  width:'100%',
  height:'auto',
  overflow:"hidden",
  "@media (max-width: 600px)": {
    height:"280px",
  },
})

const PreviousBtn = (props) =>{
  const {className,onClick} = props;
   return (
    <div className={className} onClick={onClick}>
      <ArrowBack sx={{color:'#374151',zIndex:'100',background:'white',borderRadius:'50px',fontSize:{xs:'28px',md:'36px'},marginLeft:{xs:'10px',md:'50px'},boxShadow:'0 2px 8px rgba(0,0,0,0.15)','&:hover':{background:'#f3f4f6'}}} />
    </div>
   )
}

const NextBtn = (props) =>{
   const {className,onClick} = props;
   return (
    <div className={className} onClick={onClick}>
      <ArrowForward sx={{color:'#374151',fontSize:{xs:'28px',md:'36px'},background:'white',borderRadius:'50px',marginLeft:{xs:'-10px',md:'-30px'},boxShadow:'0 2px 8px rgba(0,0,0,0.15)','&:hover':{background:'#f3f4f6'}}}/>
    </div>
   )
}

const SliderProduct = ({Data}) => {
  const settings = {
    dots: true,
    arrows:true,
    infinite:true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay:true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    initialSlide:0,
    prevArrow:<PreviousBtn />,
    nextArrow:<NextBtn />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          speed: 300,
          arrows:true,
        },
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          speed: 300,
          arrows:false,
          autoplay:true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          speed: 300,
          arrows:false,
          autoplay:true,
          dots: true,
        },
      },
    ]
  };
  return (
    <div className='py-2'>
    <SliderContainer>
       <SliderInnerContainer>
    <Slider {...settings}>
     {Data && Data.map((item)=>(
      <HomeSlider key={item.key} posterLinks={item} />
      ))}
    </Slider>
      </SliderInnerContainer>
    </SliderContainer>
    </div>
  )
}

export default SliderProduct

'use client'
import { Box, styled } from '@mui/material'
import { useRouter } from 'next/navigation'
import React from 'react'

const SliderContainer = styled("div")({
  width: "100%",
  height: "500px",
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  "@media (max-width: 900px)": {
    height: "350px",
  },
  "@media (max-width: 600px)": {
    height: "280px",
  },
})
const ImageContainer = styled("div")({
  display: "flex",
  width: "100%",
  height: "100%",
  position: 'relative',
})
const Image = styled("img")({
  width: "100%",
  height: "100%",
  margin:'6px',
  objectFit: "cover",
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  "@media (max-width: 600px)": {
    margin: '4px',
    borderRadius: '12px',
  },
})

const HomeSlider = ({ posterLinks }) => {
  const router = useRouter();

  return (
    <SliderContainer>
      <ImageContainer>
        <Box sx={{ width: '100%', height: '100%' }}>
          <Image src={posterLinks.image} alt="product slider" />
        </Box>
      </ImageContainer>
    </SliderContainer>
  )
}

export default HomeSlider

'use client'
import Products from '@/contents/product/Product';
import { useRouter } from 'next/navigation'

import React from 'react'
 
const Product = () => {
    const router= useRouter();
  
  return (
    <div>
      <Products/>
    </div>
  )
}

export default Product;

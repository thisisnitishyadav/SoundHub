"use client"
import { store } from '@/redux/store/store'
import React from 'react'
import { Provider } from 'react-redux'
import CustomerLayout from '@/components/layout/CustomerLayout'
import GoogleAuthHandler from '@/components/auth/GoogleAuthHandler'

const Providers = ({children}) => {
  return (
    <Provider store={store}>
      <GoogleAuthHandler />
      <CustomerLayout>{children}</CustomerLayout>
    </Provider>
  )
}

export default Providers

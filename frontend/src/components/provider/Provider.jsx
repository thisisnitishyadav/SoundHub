"use client"
import { store } from '@/redux/store/store'
import React from 'react'
import { Provider } from 'react-redux'

const Providers = ({children}) => {
  return (
    <div>
      <Provider store={store}>
        {children}
      </Provider>
    </div>
  )
}

export default Providers

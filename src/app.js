import React from 'react'
import { StackNavigator, } from 'react-navigation'

import HomeRoute from './route/home'
import DetailRoute from './route/detail'

export default StackNavigator(
  {
    Home: {
      screen: HomeRoute,
    },
    Detail: {
      path: 'detail/:index',
      screen: DetailRoute
    },
  },
  {
    headerMode: 'none'
  }
)

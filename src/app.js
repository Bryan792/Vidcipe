import { StackNavigator } from 'react-navigation'

import HomeRoute from './route/home'
import DetailRoute from './route/detail'
import SettingsRoute from './route/settings'
import SearchRoute from './route/search'

export default StackNavigator( // eslint-disable-line new-cap
  {
    Home: {
      screen: HomeRoute,
    },
    Detail: {
      path: 'detail/:index',
      screen: DetailRoute,
    },
    Search: {
      screen: SearchRoute,
    },
    Settings: {
      screen: SettingsRoute,
    },
  },
  {
    headerMode: 'none',
  },
)

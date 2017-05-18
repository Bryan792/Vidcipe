import React from 'react'
import {
  View,
} from 'react-native'
import { connect } from 'react-redux'
import {
  COLOR,
  Toolbar,
} from 'react-native-material-ui'
import { TabNavigator } from 'react-navigation'

import { APP_NAME } from '../../config'

import {
  loadHot,
} from '../../action/hot'

import FavoriteList from './favorite'
import NewList from './new'
import TopList from './top'

function mapStateToProps(state) {
  return {
    isRefreshing: state.hot.get('isRefreshing'),
    reload: state.hot.get('reload'),
    compact: state.hot.get('compact'),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadHot: () => dispatch(loadHot()),
    loadHotForce: () => dispatch(loadHot(true)),
  }
}

type propTypes = {
  navigation: {},
  screenProps: {},
}

const TabContent = TabNavigator({
  New: {
    screen: ({ navigation, screenProps }: propTypes) => <NewList screenProps={{ parentNavigation: navigation, ...screenProps }} />,
  },
  Top: {
    screen: ({ navigation, screenProps }: propTypes) => <TopList screenProps={{ parentNavigation: navigation, ...screenProps }} />,
  },
  Favorite: {
    screen: ({ navigation, screenProps }: propTypes) => <FavoriteList screenProps={{ parentNavigation: navigation, ...screenProps }} />,
  },
}, {
  tabBarPosition: 'bottom',
  tabBarOptions: {
    // TODO: Somehow get actual color
    style: {
      backgroundColor: COLOR.green500,
    },
  },
})

@connect(mapStateToProps, mapDispatchToProps)
export default class extends React.PureComponent {
  state = {
    isSearchOpen: false,
  }

  props: {
    navigation: {
      navigate: Function,
    }
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}
      >
        <Toolbar
          centerElement={APP_NAME}
          rightElement={['search', 'more-vert']}
          onRightElementPress={({ action }) => {
            switch (action) {
              case 'more-vert':
                this.props.navigation.navigate('Settings')
                break
              case 'search':
                this.props.navigation.navigate('Search')
                break
              default:
                break
            }
          }}
        />
        <View
          style={{
            flex: 1,
          }}
        >
          <TabContent screenProps={{ navigation: this.props.navigation }} />
        </View>
      </View>
    )
  }
}

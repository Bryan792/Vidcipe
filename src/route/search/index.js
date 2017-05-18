import React from 'react'
import {
  View,
} from 'react-native'
import { connect } from 'react-redux'
import {
  Toolbar,
} from 'react-native-material-ui'

import SearchList from './search-list'

import {
  loadHot,
} from '../../action/hot'

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

@connect(mapStateToProps, mapDispatchToProps)
export default class extends React.PureComponent {
  state = {
    searchQuery: '',
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  props: {
    navigation: {
      goBack: Function,
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
          leftElement="arrow-back"
          onLeftElementPress={() => this.props.navigation.goBack()}
          centerElement={'Search'}
          searchable={{
            placeholder: 'Search',
            onChangeText: (text) => {
              clearTimeout(this.timeout)
              this.timeout = setTimeout(() => {
                this.setState({ searchQuery: text.trim() })
              }, 500)
            },
            onSearchClosed: () => {
              this.props.navigation.goBack()
            },
            autoFocus: true,
          }}
        />
        <SearchList searchQuery={this.state.searchQuery} screenProps={{ navigation: this.props.navigation }} />
      </View>
    )
  }
}

import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { Toolbar } from 'react-native-material-ui'

import { APP_NAME } from '../../config'

import {
  loadHot,
  search,
  loadHotAppendSuccess,
  setFavorite,
  unsetFavorite,
} from '../../action/hot'
import Post from './post'

import VirtualizedList from '../../../node_modules/react-native/Libraries/CustomComponents/Lists/VirtualizedList'

function mapStateToProps(state) {
  return {
    posts: state.hot.get('posts'),
    length: state.hot.get('length'),
    isRefreshing: state.hot.get('isRefreshing'),
    filterFavorite: state.hot.get('filterFavorite'),
    reload: state.hot.get('reload'),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadHot: () => dispatch(loadHot()),
    loadHotForce: () => dispatch(loadHot(true)),
    loadHotAppend: () => dispatch(loadHotAppendSuccess()),
    search: term => dispatch(search(term)),
    setFilterFavorite: shouldSet => (shouldSet ? dispatch(setFavorite()) : dispatch(unsetFavorite())),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class HomePage extends React.PureComponent {
  state = {}

  componentDidMount() {
    this.props.loadHot()
  }

  props: {
    posts: [],
    loadHot: Function,
    length: number,
    search: Function,
    filterFavorite: boolean,
    setFilterFavorite: Function,
    navigation: {
      navigate: Function,
    },
    isRefreshing: boolean,
    loadHotForce: Function,
    loadHotAppend: Function,
  }

  timeout = undefined;
  _onLayout = (event) => {
    if (this.state.dimensions) return // layout was already called
    let { width, height } = event.nativeEvent.layout
    this.setState({ dimensions: { width, height } })
  }

  render() {
    let posts = this.props.posts.slice(0, this.props.length)
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <Toolbar
          centerElement={APP_NAME}
          searchable={{
            placeholder: 'Search',
            onChangeText: (text) => {
              clearTimeout(this.timeout)
              this.timeout = setTimeout(() => {
                this.props.search(text.trim())
              }, 700)
            },
            onSearchClosed: () => {
              clearTimeout(this.timeout)
              this.props.search()
            },
          }}
          rightElement={[this.props.filterFavorite ? 'star' : 'star-border', this.state.compact ? 'view-headline' : 'view-stream']}
          onRightElementPress={({ action }) => {
            if (action.startsWith('star')) {
              this.props.setFilterFavorite(!this.props.filterFavorite)
            } else {
              this.setState({ compact: !this.state.compact })
            }
          }}
        />

        <VirtualizedList
          maxToRenderPerBatch={2}
          onLayout={this._onLayout}
          data={posts}
          renderItem={({ item, index }) => (
              <Post
                compact={this.state.compact}
                dimensions={this.state.dimensions}
                backupThumbnailUrl={item.backupThumbnailUrl}
                thumbnailUrl={item.thumbnailUrl}
                thumbnailWidth={item.thumbnailWidth}
                thumbnailHeight={item.thumbnailHeight}
                score={item.score}
                title={item.title}
                onPostSelected={() => {
                  this.props.navigation.navigate('Detail', { index })
                }}
              />
          )}
          refreshing={this.props.isRefreshing}
          onRefresh={this.props.loadHotForce}
          onEndReached={this.props.loadHotAppend}
          keyExtractor={item => item.id}
        />
      </View>
    )
  }
}

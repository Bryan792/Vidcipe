import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { Toolbar } from 'react-native-material-ui'

import { APP_NAME } from '../../config'

import {
  loadHot,
  search,
  loadHotAppendSuccess,
} from '../../action/hot'
import Post from './post'

import VirtualizedList from '../../../node_modules/react-native/Libraries/CustomComponents/Lists/VirtualizedList'

function mapStateToProps(state) {
  return {
    posts: state.hot.get('posts'),
    length: state.hot.get('length'),
    isRefreshing: state.hot.get('isRefreshing'),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadHot: () => dispatch(loadHot()),
    loadHotForce: () => dispatch(loadHot(true)),
    loadHotAppend: () => dispatch(loadHotAppendSuccess()),
    search: (term) => dispatch(search(term)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class HomePage extends React.PureComponent {
  state = {}
  timeout = undefined;

  componentDidMount() {
    this.props.loadHot()
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
          rightElement={this.state.compact ? 'view-headline' : 'view-stream'}
          onRightElementPress={() => this.setState({ compact: !this.state.compact })}
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
          keyExtractor={(item) => item.id}
        />
      </View>
    )
  }

  _onLayout = event => {
    if (this.state.dimensions) return // layout was already called
    let { width, height } = event.nativeEvent.layout
    this.setState({ dimensions: { width, height } })
  }
}

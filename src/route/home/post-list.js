import React from 'react'
import { connect } from 'react-redux'

import {
  loadHot,
} from '../../action/hot'

import Post from './post'

import VirtualizedList from '../../../node_modules/react-native/Libraries/CustomComponents/Lists/VirtualizedList'

function mapStateToProps(state) {
  return {
    isRefreshing: state.hot.get('isRefreshing'),
    reload: state.hot.get('reload'),
    compact: state.hot.get('compact'),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadHotForce: () => dispatch(loadHot(true)),
  }
}
@connect(mapStateToProps, mapDispatchToProps)
export default class extends React.Component {
  state = {
    length: 10,
  }

  props: {
    screenProps: {
      navigation: {
        navigate: Function,
      },
    },
    posts: [],
    isRefreshing: boolean,
    loadHotForce: Function,
    compact: boolean,
  }

  _onLayout = (event) => {
    if (this.state.dimensions) return // layout was already called
    let { width, height } = event.nativeEvent.layout
    this.setState({ dimensions: { width, height } })
  }

  render() {
    return (
        <VirtualizedList
          maxToRenderPerBatch={2}
          onLayout={this._onLayout}
          data={this.props.posts.slice(0, this.state.length)}
          renderItem={({ item, index }) => (
              <Post
                compact={this.props.compact}
                dimensions={this.state.dimensions}
                backupThumbnailUrl={item.backupThumbnailUrl}
                thumbnailUrl={item.thumbnailUrl}
                thumbnailWidth={item.thumbnailWidth}
                thumbnailHeight={item.thumbnailHeight}
                score={item.score}
                title={item.title}
                onPostSelected={() => {
                  this.props.screenProps.navigation.navigate('Detail', { index, posts: this.props.posts.slice(0, this.state.length) })
                }}
              />
          )}
          refreshing={this.props.isRefreshing}
          onRefresh={this.props.loadHotForce}
          onEndReached={() => this.setState({ length: this.state.length + 10 })}
          keyExtractor={item => item.id}
        />
    )
  }
}

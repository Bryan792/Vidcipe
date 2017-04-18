import React from 'react'
import { Text, View } from 'react-native'
import _ from 'lodash'
import { connect } from 'react-redux';
import InfiniteScrollView from 'react-native-infinite-scroll-view'
import { Toolbar } from 'react-native-material-ui'

import realm from '../../db-manager'

import {
  loadHot,
  loadMoreHot,
  search,
} from '../../action/hot'
import Post from './post'

import VirtualizedList from '../../../node_modules/react-native/Libraries/CustomComponents/Lists/VirtualizedList'

function mapStateToProps(state) {
  return { 
    posts: state.hot.get('posts'), 
    isRefreshing: state.hot.get('isRefreshing'),
  }
}

function mapDispatchToProps(dispatch) {
  return { 
    loadHot: () => dispatch(loadHot()),
    loadHotAppend: () => dispatch(loadHot(true)),
    search: (term) => dispatch(search(term)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class HomePage extends React.Component {
  state = {}
  timeout = undefined;

  componentDidMount() {
    this.props.loadHot()
  }

  render() {
    return ( 
      <View style={{
        flex: 1
      }}>
        <Toolbar
          centerElement=""
          searchable={{
            placeholder: 'Search',
            onChangeText: (text) => {
              clearTimeout(this.timeout)
              this.timeout = setTimeout(() => { 
                this.props.search(text.trim())
              }, 1000)
            },
            onSearchClosed: () => {
              clearTimeout(this.timeout)
              this.props.search()
            }
          }}
        />

        <VirtualizedList
          maxToRenderPerBatch={2}
          onLayout={this._onLayout}
          data={this.props.posts}
          renderItem={({item, index}) => {
            return (
              <Post
                dimensions={this.state.dimensions}
                backupThumbnailUrl={item.backupThumbnailUrl}
                thumbnailUrl={item.thumbnailUrl}
                thumbnailWidth={item.thumbnailWidth}
                thumbnailHeight={item.thumbnailHeight}
                score={item.score}
                title={item.title} 
                onPostSelected={() => {
                  this.props.navigation.navigate('Detail', {index: index})}
                }
              />
            )
          }}
          refreshing={this.props.isRefreshing}
          onRefresh={this._onRefresh}
          onEndReached={this.props.loadHotAppend}
          keyExtractor={(item, index) => item.id}
        />
      </View>
    )
  }

  _onRefresh = () => {
    this.props.loadHot()
  }

  _onLayout = event => {
    if (this.state.dimensions) return // layout was already called
    let {width, height} = event.nativeEvent.layout
    this.setState({dimensions: {width, height}})
  }
}

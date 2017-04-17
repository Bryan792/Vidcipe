import React from 'react'
import { Text, View } from 'react-native'
import _ from 'lodash'
import { connect } from 'react-redux';
import InfiniteScrollView from 'react-native-infinite-scroll-view'

import {
  loadHot,
  loadMoreHot,
} from '../../action/hot'
import Post from './post'
import FlatList from '../../../node_modules/react-native/Libraries/CustomComponents/Lists/FlatList'

function mapStateToProps(state) {
  return { 
    posts: state.hot.get('posts') || [], 
    isRefreshing: state.hot.get('isRefreshing'),
  }
}

function mapDispatchToProps(dispatch) {
  return { 
    loadHot: () => dispatch(loadHot()),
    loadHotAppend: () => dispatch(loadHot(true)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class HomePage extends React.Component {
  componentDidMount() {
    this.props.loadHot()
  }

  render() {
    return ( 
      <View>
        <FlatList
          data={this.props.posts}
          renderItem={({item, index}) => {
            let thumbnail = _.get(item, 'data.preview.images[0].source')
            if (!thumbnail) thumbnail = {url: item.data.thumbnail}
            return (
              <Post
                thumbnail={thumbnail}
                score={item.data.score}
                title={item.data.title} 
                onPostSelected={() => this.props.navigation.navigate('Detail', {index: index})}
              />
            )
          }}
          refreshing={this.props.isRefreshing}
          onRefresh={this._onRefresh}
          onEndReached={this.props.loadHotAppend}
          keyExtractor={(item, index) => item.data.id}
        />
      </View>
    )
  }

  _onRefresh = () => {
    console.log('refresh')
    this.props.loadHot()
  }
}

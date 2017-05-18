import React from 'react'
import {
  Text,
  View,
} from 'react-native'

import realm from '../../db-manager'
import PostList from '../home/post-list'

type propsType = {
  searchQuery?: string,
}

const SearchScreen = (props: propsType) => {
  if (!props.searchQuery) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
          }}
        >Search Results</Text>
      </View>
    )
  }
  let posts = realm.objects('Post').filtered('isHidden == false').filtered(`title CONTAINS[c] "${props.searchQuery}"`).sorted('score', true)
  if (posts.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
          }}
        >No Search Results</Text>
      </View>
    )
  }
  return <PostList {...props} posts={posts} />
}

export default SearchScreen

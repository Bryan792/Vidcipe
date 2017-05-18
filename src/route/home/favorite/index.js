import React from 'react'
import {
  Text,
  View,
} from 'react-native'

import realm from '../../../db-manager'
import PostList from '../post-list'

const FavoriteScreen = (props) => {
  let posts = realm.objects('Post').filtered('isHidden == false').filtered('favorite == true').sorted('created', true)
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
        >No Favorites</Text>
      </View>
    )
  }
  return <PostList {...props} posts={posts} />
}

export default FavoriteScreen

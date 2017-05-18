import React from 'react'

import realm from '../../../db-manager'
import PostList from '../post-list'

const NewScreen = (props) => {
  let posts = realm.objects('Post').filtered('isHidden == false').sorted('created', true)
  return <PostList {...props} posts={posts} />
}

export default NewScreen

import React from 'react'

import realm from '../../../db-manager'
import PostList from '../post-list'

export default (props) => {
  let posts = realm.objects('Post').filtered('isHidden == false').sorted('score', true)
  return <PostList {...props} posts={posts} />
}

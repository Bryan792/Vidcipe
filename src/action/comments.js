import { createAction } from 'redux-actions'

import realm from '../db-manager'

export const LOAD_COMMENTS = 'LOAD_COMMENTS'
export const LOAD_COMMENTS_SUCCESS = 'LOAD_COMMENTS_SUCCESS'

export const loadCommentsStart = createAction(LOAD_COMMENTS)
export const loadCommentsSuccess = createAction(LOAD_COMMENTS_SUCCESS)

export const loadComments = post => (dispatch, getState) => {
  const id = post.id
  if (getState().comments.includes(id)) return
  dispatch(loadCommentsStart({
    id,
  }))
  fetch(`https://reddit.com${post.permalink}.json?sort=confidence&limit=10&depth=1&raw_json=1`)
    .then(response => response.json())
    .then(response =>
      response[1].data.children
        .filter(comment => comment.kind === 't1')
        .filter(comment => comment.body !== '[deleted]')
        .sort((comment1, comment2) => {
          if (comment1.data.author !== comment2.data.author) {
            if (comment1.data.author === post.author) return -1
            if (comment2.data.author === post.author) return 1
          }
          return comment1.data.score - comment2.data.score
        })
        .map(comment => (
          {
            body: comment.data.body,
            author: comment.data.author,
          }
        )),
    )
    .then((comments) => {
      realm.write(() => {
        const realmPost = post
        realmPost.comments = comments
      })
      dispatch(loadCommentsSuccess(id))
    })
}

import Immutable from 'immutable'

import {
  LOAD_COMMENTS,
  LOAD_COMMENTS_SUCCESS,
} from '../action/comments'

const initialState = Immutable.fromJS({
})

export default (state = initialState, action) => {
  switch(action.type) {
    case LOAD_COMMENTS:
      return state.set(action.payload.id, [])
    case LOAD_COMMENTS_SUCCESS:
      return state.set(action.payload.id, action.payload.comments)
    default:
      return state
  }
}

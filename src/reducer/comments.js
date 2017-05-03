import Immutable from 'immutable'

import {
  LOAD_COMMENTS,
  LOAD_COMMENTS_SUCCESS,
} from '../action/comments'

const initialState = Immutable.fromJS({
})

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_COMMENTS:
      return state
    case LOAD_COMMENTS_SUCCESS:
      return state.set(action.payload, Date.now())
    default:
      return state
  }
}

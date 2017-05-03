import Immutable from 'immutable'

import {
  LOAD_DETAIL_SUCCESS,
} from '../action/detail'

const initialState = Immutable.fromJS({
})

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_DETAIL_SUCCESS:
      return state.set(action.payload, Date.now())
    default:
      return state
  }
}

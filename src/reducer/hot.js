import Immutable from 'immutable'
import realm from '../db-manager'

import {
  LOAD_HOT,
  LOAD_HOT_SUCCESS,
  LOAD_HOT_APPEND_SUCCESS,
  SEARCH_SET,
  SET_FAVORITE,
  UNSET_FAVORITE,
  RELOAD_HOT,
} from '../action/hot'

const initialState = Immutable.fromJS({
  posts: realm.objects('Post').sorted('created', true).filtered('isHidden == false'),
  isRefreshing: false,
  filterFavorite: false,
  searchQuery: '',
  length: 25,
})

export default (state = initialState, action) => {
  function getPosts(searchQuery, filterFavorite) {
    let posts = realm.objects('Post')
    if (!filterFavorite && !searchQuery) {
      return initialState.get('posts')
    }
    if (filterFavorite) {
      posts = posts.filtered('favorite == true')
    }
    if (searchQuery) {
      posts = posts.filtered(`title CONTAINS[c] "${searchQuery}"`)
    }
    return posts.sorted('score', true).filtered('isHidden == false')
  }

  switch (action.type) {
    case LOAD_HOT:
      return state.set('isRefreshing', true)
    case LOAD_HOT_SUCCESS:
      return state
        .set('isRefreshing', false)
    case LOAD_HOT_APPEND_SUCCESS:
      // TODO limit the length based on array length
      return state
        .set('length', state.get('length') + 25)
    case SEARCH_SET:
      return state
          .set('posts', getPosts(action.payload, state.get('filterFavorite')))
          .set('length', initialState.get('length'))
          .set('searchQuery', action.payload)
    case SET_FAVORITE:
      return state
          .set('posts', getPosts(state.get('searchQuery'), true))
          .set('length', initialState.get('length'))
          .set('filterFavorite', true)
    case UNSET_FAVORITE:
      return state
          .set('posts', getPosts(state.get('searchQuery'), false))
          .set('length', initialState.get('length'))
          .set('filterFavorite', false)
    case RELOAD_HOT:
      // TODO force anyone using this to reload, is this the best way?
      return state.set('reload', Date.now())
    default:
      return state
  }
}

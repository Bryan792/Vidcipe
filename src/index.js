import React from 'react'
import { View, Text } from 'react-native'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';

import hotReducer from './reducer/hot'
import detailReducer from './reducer/detail'
import commentsReducer from './reducer/comments'
import App from './app'

const store = createStore(combineReducers({
  hot: hotReducer,
  detail: detailReducer,
  comments: commentsReducer,
}), applyMiddleware(thunk))

const wrapApp = (AppComponent) => () =>
  <Provider store={store}>
    <AppComponent />
  </Provider>

export default wrapApp(App)

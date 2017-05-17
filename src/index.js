import React from 'react'
import codePush from 'react-native-code-push'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import { COLOR, ThemeProvider } from 'react-native-material-ui'

import hotReducer from './reducer/hot'
import detailReducer from './reducer/detail'
import commentsReducer from './reducer/comments'
import App from './app'

if (!__DEV__) { // eslint-disable-line no-undef
  [
    'assert',
    'clear',
    'count',
    'debug',
    'dir',
    'dirxml',
    'error',
    'exception',
    'group',
    'groupCollapsed',
    'groupEnd',
    'info',
    'log',
    'profile',
    'profileEnd',
    'table',
    'time',
    'timeEnd',
    'timeStamp',
    'trace',
    'warn',
  ].forEach((methodName) => {
    console[methodName] = () => { // eslint-disable-line no-console
      /* noop */
    }
  })
}

const uiTheme = {
  palette: {
    primaryColor: COLOR.green500,
  },
  toolbar: {
    container: {
      height: 50,
    },
  },
}

const store = createStore(combineReducers({
  hot: hotReducer,
  detail: detailReducer,
  comments: commentsReducer,
}), applyMiddleware(thunk))

const wrapApp = AppComponent => () =>
  <Provider store={store}>
    <ThemeProvider uiTheme={uiTheme}>
      <AppComponent />
    </ThemeProvider>
  </Provider>

const WrappedApp = wrapApp(App)

// eslint-disable-next-line react/prefer-stateless-function
class AppWrapper extends React.PureComponent {
  render() {
    return <WrappedApp />
  }
}

export default codePush(AppWrapper)

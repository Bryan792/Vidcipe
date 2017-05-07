import React from 'react'
import { InteractionManager, View } from 'react-native'
import { connect } from 'react-redux'
import Swiper from 'react-native-swiper'
import { Toolbar } from 'react-native-material-ui'

import { APP_NAME } from '../../config'
import realm from '../..//db-manager'
import DetailPage from './detail-page'

import {
  loadDetail,
} from '../../action/detail'

function mapStateToProps(state) {
  return {
    posts: state.hot.get('posts'),
    length: state.hot.get('length'),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadDetail: (id) => dispatch(loadDetail(id)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class DetailView extends React.Component {

  state={
    index: +this.props.navigation.state.params.index,
    renderPlaceholderOnly: true,
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ renderPlaceholderOnly: false })
    })
  }

  props: {
    navigation: {
      state: {
        params: {
          index: string,
        }
      },
      goBack: Function,
    },
    posts: [],
    length: number,
  }

  _onLayout = event => {
    if (this.state.dimensions) return // layout was already called
    let { width, height } = event.nativeEvent.layout
    this.setState({ dimensions: { width, height } })
  }

  // TODO onPageScrollStateChanged is android only, need ios fix
  render() {
    let posts = this.props.posts.slice(0, this.props.length)
    let pages = []
    for (let index = 0; index < posts.length; index++) {
      pages.push(this.state.dimensions && Math.abs(this.state.index - index) <= (this.state.placeholder ? 0 : 2) && (
          <DetailPage
            postId={posts[index].id}
            key={posts[index].id}
            shouldGetVideo={this.state.index === index && this.state.scrollState !== 'dragging'}
            dimensions={this.state.dimensions}
          />
      ))
    }
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <Toolbar
          leftElement="arrow-back"
          onLeftElementPress={() => this.props.navigation.goBack()}
          centerElement={APP_NAME}
          rightElement={posts[this.state.index].favorite ? 'star' : 'star-border'}
          onRightElementPress={() => {
            realm.write(() => {
              posts[this.state.index].favorite = !posts[this.state.index].favorite
            })
            // force update instead of this.setState(this.state) because future logic (PureComponent) might check state and there is no change in the state
            this.forceUpdate()
          }}
        />
        {!this.state.renderPlaceholderOnly &&
        <Swiper
          showsPagination={false}
          loop={false}
          style={{
            flex: 1,
          }}
          index={+this.props.navigation.state.params.index}
          onMomentumScrollEnd={(e, state) => {
            this.setState({ index: state.index })
          }}
          onPageScrollStateChanged={(scrollState) => {
            this.setState({ scrollState })
          }}
          onLayout={this._onLayout}
        >
          {pages}
        </Swiper>
        }
      </View>
    )
  }
}

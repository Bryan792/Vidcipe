import React from 'react'
import {
  InteractionManager,
  View,
  Share,
} from 'react-native'
import { connect } from 'react-redux'
import Swiper from 'react-native-swiper'
import { Toolbar } from 'react-native-material-ui'

import realm from '../..//db-manager'
import DetailPage from './detail-page'

import {
  hidePost,
  reloadHot,
} from '../../action/hot'

import {
  loadDetail,
} from '../../action/detail'

function mapStateToProps(state) {
  return {
    length: state.hot.get('length'),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadDetail: id => dispatch(loadDetail(id)),
    hidePost: post => dispatch(hidePost(post)),
    reloadPosts: () => dispatch(reloadHot()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class DetailView extends React.Component {

  state={
    index: +this.props.navigation.state.params.index,
    renderPlaceholderOnly: true,
    // When you slice a RealmResults, properties are still cross-referenced with the db, but the actual query will not be run again, so we need to manually remove when we choose to remove
    posts: this.props.navigation.state.params.posts.slice(0, this.props.navigation.state.params.length),
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ renderPlaceholderOnly: false })
    })
  }

  componentWillUnmount() {
    // We use this as a notification mechanism to reload posts
    // We decide to only notify on unmount because we do not want the posts to reload while we are viewing them, but only in this scenario
    // We favorite something, but if we are viewing the favorite list, we do not wan the list to change
    // On the other hand, if we are hiding a post, we want the change immediately
    // TODO: This breaks if you favorite a bunch, but somehow cause a reload by deleting something
    if (this.state.favoriteChanged) {
      this.props.reloadPosts()
    }
  }

  props: {
    navigation: {
      state: {
        params: {
          index: string,
          posts: [],
          length: number,
        }
      },
      goBack: Function,
    },
    posts: [],
    hidePost: Function,
    reloadPosts: Function,
  }

  _onLayout = (event) => {
    if (this.state.dimensions) return // layout was already called
    let { width, height } = event.nativeEvent.layout
    this.setState({ dimensions: { width, height } })
  }

  // TODO onPageScrollStateChanged is android only, need ios fix
  render() {
    let posts = this.state.posts
    let currentPost = posts[this.state.index]
    let pages = []
    // TODO: ideally we want pages to be dynamic but for some reason, the rerender only works at the initial size of pages, so even if we increase pages later, the viewpager does not see past the initial size, so for now we will have the posts sent in be already sliced, we cannot resize
    for (let index = 0; index < posts.length; index += 1) {
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
          backgroundColor: 'white',
        }}
      >
        <Toolbar
          leftElement="arrow-back"
          onLeftElementPress={() => this.props.navigation.goBack()}
          centerElement={currentPost.title}
          rightElement={['share', 'delete', currentPost.favorite ? 'star' : 'star-border']}
          onRightElementPress={({ action }) => {
            if (action === 'delete') {
              this.props.hidePost(currentPost)
              if (posts.length === 1) {
                this.props.navigation.goBack()
              } else {
                let newPosts = this.state.posts.slice()
                newPosts.splice(this.state.index, 1)
                this.setState({
                  posts: newPosts,
                  index: (this.state.index === posts.length - 1) ? this.state.index - 1 : this.state.index,
                })
              }
            } else if (action === 'share') {
              Share.share({
                message: `${currentPost.title} https://reddit.com${currentPost.permalink}`,
              })
            } else if (action.startsWith('star')) {
              realm.write(() => {
                currentPost.favorite = !currentPost.favorite
              })
              // TODO this is ugly, we shouldnt use forceUpdate
              this.setState({ favoriteChanged: true })
              this.forceUpdate()
            }
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

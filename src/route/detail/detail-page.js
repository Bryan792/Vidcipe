import React from 'react'
import { Text, View, ListView, TouchableWithoutFeedback, ScrollView, Image } from 'react-native'
import { connect } from 'react-redux';
import _ from 'lodash'
import styled from 'styled-components/native'
import Video from 'react-native-video'

import Swiper from 'react-native-swiper';

import Post from '../home/post'

import {
  loadDetail,
} from '../../action/detail'

import {
  loadComments,
} from '../../action/comments'

function mapStateToProps(state) {
  return { 
    posts: state.hot.get('posts') || [],
    videoUri: (id) => state.detail.get(id),
    getComments: (id) => state.comments.get(id),
  }
}

function mapDispatchToProps(dispatch) {
  return { 
    loadDetail: (postIdx) => dispatch(loadDetail(postIdx)),
    loadComments: (postIdx) => dispatch(loadComments(postIdx)),
  }
}

class FitVideo extends React.Component {
  state = {
    paused: false,
  }

  render() {
    const { videoInfo, onLoad } = this.props
    return (
      <TouchableWithoutFeedback
        onPress={() => this.setState({paused: !this.state.paused})}
      >
        <Video
          source={{ uri: videoInfo.videoUrl }}
          rate={1.0}
          volume={1.0}
          muted={false}
          paused={this.state.paused}
          resizeMode="contain"
          repeat
          style={{
            height: videoInfo.height / videoInfo.width * this.props.width,
          }}
          onLoad={onLoad}
        />
      </TouchableWithoutFeedback>
    )
  }
}

const Title = styled.Text`
  color: red;
`

const Comment = styled.Text`
  border-bottom-width: 1;
  padding: 5;
`

const Score = styled.Text`
  color: blue;
  width: 50;
`

@connect(mapStateToProps, mapDispatchToProps)
export default class DetailPage extends React.Component {
  state = {
  }

  componentDidMount() {
    const post = this.props.posts[this.props.postIndex]
    console.log('mounted', this.props.postIndex)
    this.props.loadDetail(this.props.postIndex)
    this.props.loadComments(this.props.postIndex)
  }

  render() {
    const post = this.props.posts[this.props.postIndex]
    const { videoUri, getComments } = this.props
    const videoInfo = videoUri(post.data.id)
    const comments = getComments(post.data.id)
    let thumbnail = _.get(post, 'data.preview.images[0].source')
    if (!thumbnail) thumbnail = {url: post.data.thumbnail}
    console.log('loading', this.props.postIndex)
    return ( 
      <View
        style={{
          flex: 1,
          alignItems: 'stretch',
          backgroundColor: 'white',
        }}
      >
        <ScrollView>
          {this.props.dimensions &&
          <View
            style={{
              height: thumbnail.height / thumbnail.width * this.props.dimensions.width,
              width: this.props.dimensions.width,
              backgroundColor: 'blue',
            }} 
          >
          {(!this.props.shouldGetVideo || !this.state.isLoaded) &&
          <Image 
            style={{flex: 1}}
            source={{ uri: thumbnail.url }} 
          />
          }
          {videoInfo && this.props.shouldGetVideo &&
          <FitVideo 
            videoInfo={videoInfo} 
            width={this.state.isLoaded ? this.props.dimensions.width : 0}
            onLoad={() => {
              this.setState({isLoaded: true})
            }}
          />
          }
          </View>
          }
          <Title>{post.data.title}</Title>
      {comments && comments.map(comment => (
          <Comment key={comment}>{comment}</Comment>
      ))}
        </ScrollView>
      </View>
    )
  }

}

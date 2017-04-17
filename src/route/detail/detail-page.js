import React from 'react'
import { Text, View, ListView, TouchableWithoutFeedback, ScrollView } from 'react-native'
import { connect } from 'react-redux';
import _ from 'lodash'
import styled from 'styled-components/native'
import Video from 'react-native-video'
import CachedImage from 'react-native-cached-image'

import Swiper from 'react-native-swiper';

import realm from '../../db-manager'
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
    loadDetail: (post) => dispatch(loadDetail(post)),
    loadComments: (post) => dispatch(loadComments(post)),
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

  post = realm.objectForPrimaryKey('Post', this.props.postId)

  state = {
  }

  componentDidMount() {
    this.props.loadDetail(this.post)
    this.props.loadComments(this.post)
  }

  render() {
    const post = this.post
    const { videoUri, getComments, postId } = this.props
    const videoInfo = videoUri(postId)
    const comments = getComments(postId)
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
          <View style={{
            height: post.thumbnailHeight / post.thumbnailWidth * this.props.dimensions.width,
            width: this.props.dimensions.width,
          }}>
          {(!this.props.shouldGetVideo || !this.state.isLoaded) &&
          <CachedImage 
            style={{flex: 1}}
            source={{ uri: post.thumbnailUrl }} 
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
          <Title>{post.title}</Title>
      {comments && comments.map(comment => (
          <Comment key={comment}>{comment}</Comment>
      ))}
        </ScrollView>
      </View>
    )
  }

}

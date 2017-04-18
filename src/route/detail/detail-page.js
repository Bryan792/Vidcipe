import React from 'react'
import { Linking, Text, View, ListView, TouchableWithoutFeedback, ScrollView } from 'react-native'
import { connect } from 'react-redux';
import _ from 'lodash'
import styled from 'styled-components/native'
import Video from 'react-native-video'
import CachedImage from 'react-native-cached-image'
import { Divider, Button } from 'react-native-material-ui'
import Icon from 'react-native-vector-icons/FontAwesome';


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
  font-size: 20;
  margin-bottom: 16;
`

const CommentsHeader = styled.Text`
  font-size: 17;
`

const CommentBox = styled.View`
  padding: 5 0;
`

const CommentBody = styled.Text`
  font-size: 14;
`

const CommentAuthor = styled.Text`
  font-size: 14;
  font-weight: bold;
`

const Score = styled.Text`
  color: blue;
  width: 50;
`

const InfoBox = styled.View`
  flex: 1;
  padding: 16;
`

@connect(mapStateToProps, mapDispatchToProps)
export default class DetailPage extends React.PureComponent {

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
          position: 'absolute',
          top: 0,
          bottom: 74,
          left: 0,
          right: 0,
          alignItems: 'stretch',
          backgroundColor: 'white',
        }}
      >
        <ScrollView
          style={{flex: 1}}
        >
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
          <InfoBox>
            <Title>{post.title}</Title>
            {comments && comments.length > 0 &&
            <View>
              <CommentsHeader>Comments</CommentsHeader>
              {comments.map(comment => (
              <View key={comment}>
                <CommentBox>
                  <CommentAuthor>Author</CommentAuthor>
                  <CommentBody>{comment}</CommentBody>
                </CommentBox>
                <Divider />
              </View>
              ))}
            </View>
            }
            <Button 
              icon={<Icon name="reddit" />} 
              text="View More"
              onPress={() => Linking.openURL('https://reddit.com' + post.permalink)}
            />
          </InfoBox>
        </ScrollView>
      </View>
    )
  }

}

import React from 'react'
import { Linking, Text, View, ListView, TouchableWithoutFeedback, ScrollView, InteractionManager } from 'react-native'
import { connect } from 'react-redux';
import _ from 'lodash'
import styled from 'styled-components/native'
import Video from 'react-native-video'
import CachedImage from 'react-native-cached-image'
import { Divider, Button } from 'react-native-material-ui'
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment'

import Swiper from 'react-native-swiper';

import realm from '../../db-manager'
import Post from '../home/post'
import ThumbnailImage from '../../components/thumbnail-image'

import {
  loadDetail,
} from '../../action/detail'

import {
  loadComments,
} from '../../action/comments'

function mapStateToProps(state) {
  return { 
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

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {...ownProps, ...dispatchProps,
    video: stateProps.videoUri(ownProps.postId),
    comments: stateProps.getComments(ownProps.postId),
  }
}

class FitVideo extends React.Component {
  state = {
    paused: false,
  }

  render() {
    const { videoUrl, videoHeight, videoWidth, onLoad } = this.props
    return (
      <TouchableWithoutFeedback
        onPress={() => this.setState({paused: !this.state.paused})}
      >
        <Video
          source={{ uri: videoUrl }}
          rate={1.0}
          volume={1.0}
          muted={false}
          paused={this.state.paused}
          resizeMode="contain"
          repeat
          style={{
            height: videoHeight / videoWidth * this.props.width,
          }}
          onLoad={onLoad}
        />
      </TouchableWithoutFeedback>
    )
  }
}

const DescriptionContainer = styled.View`
  margin-bottom: 16;
`

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 2 0;
`


const Title = styled.Text`
  font-size: 18;
  color: black;
`

const Author = styled.Text`
  font-size: 14;
  font-weight: bold;
`

const DateText = styled.Text`
  font-size: 14;
`

const CommentsHeader = styled.Text`
  font-size: 16;
  padding: 5 0;
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

@connect(mapStateToProps, mapDispatchToProps, mergeProps)
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
    const { postId, videoInfo, comments } = this.props
    const { backupThumbnailUrl, thumbnailUrl, videoUrl, videoWidth, videoHeight } = post
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
            <ThumbnailImage {...{backupThumbnailUrl, thumbnailUrl}} />
          }
          {videoUrl && this.props.shouldGetVideo &&
          <FitVideo 
            {...{videoUrl, videoWidth, videoHeight}}
            width={this.props.dimensions.width}
            onLoad={() => {
              this.setState({isLoaded: true})
            }}
          />
          }
          </View>
          }
          <InfoBox>
            <DescriptionContainer>
              <Title>{post.title}</Title>
              <Row>
                <Author>{post.author} </Author>
                <DateText>{prettyPrintDate(post.created)}</DateText>
              </Row>
            </DescriptionContainer>
            {post.comments && post.comments.length > 0 &&
            <View>
              <CommentsHeader>Comments</CommentsHeader>
              <Divider />
              {post.comments.map(comment => (
              <View key={comment.body}>
                <CommentBox>
                  <CommentAuthor>{comment.author}</CommentAuthor>
                  <CommentBody>{comment.body}</CommentBody>
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

function prettyPrintDate(date) {
  return moment(date).fromNow()
}

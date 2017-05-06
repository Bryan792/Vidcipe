import React from 'react'
import {
  Linking,
  ScrollView,
  View,
  InteractionManager,
} from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import { Divider, Button, Toolbar } from 'react-native-material-ui'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'

import { APP_NAME } from '../../config'
import realm from '../../db-manager'
import ThumbnailImage from '../../components/thumbnail-image'
import PausableVideo from './pauseable-video'

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
  return { ...ownProps, ...dispatchProps,
    video: stateProps.videoUri(ownProps.postId),
    comments: stateProps.getComments(ownProps.postId),
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

const InfoBox = styled.View`
  flex: 1;
  padding: 16;
`

const Container = styled.View`
  flex: 1;
  align-items: stretch;
  background-color: white;
`

@connect(mapStateToProps, mapDispatchToProps, mergeProps)
export default class DetailPage extends React.PureComponent {

  post = realm.objectForPrimaryKey('Post', this.props.navigation.state.params.id)

  state = {
    waiting: true,
    renderPlaceholderOnly: true,
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.loadDetail(this.post)
      this.props.loadComments(this.post)
      this.setState({ renderPlaceholderOnly: false })
    })
  }
  
  _onLayout = event => {
    if (this.state.dimensions) return // layout was already called
    let { width, height } = event.nativeEvent.layout
    this.setState({ dimensions: { width, height } })
  }

  render() {
    function prettyPrintDate(date) {
      return moment(date).fromNow()
    }
    const post = this.post
    const { backupThumbnailUrl, thumbnailUrl, videoUrl, videoWidth, videoHeight } = post
    console.log(this.state)
    return (
      <Container
        onLayout={this._onLayout}
      >
        <Toolbar
          leftElement="arrow-back"
          onLeftElementPress={() => this.props.navigation.goBack()}
          centerElement={APP_NAME}
          rightElement={post.favorite ? 'star' : 'star-border'}
          onRightElementPress={() => {
            realm.write(() => {
              post.favorite = !post.favorite
            })
            // force update instead of this.setState(this.state) because future logic (PureComponent) might check state and there is no change in the state
            this.forceUpdate()
          }}
        />
        {!this.state.renderPlaceholderOnly &&
        <ScrollView
          style={{ flex: 1 }}
        >
          {this.state.dimensions &&
          <View
            style={{
              height: post.thumbnailHeight / post.thumbnailWidth * this.state.dimensions.width,
              width: this.state.dimensions.width,
            }}
          >
            {!this.state.isLoaded &&
            <ThumbnailImage {...{ backupThumbnailUrl, thumbnailUrl }} />
            }
            {videoUrl &&
            <PausableVideo
              {...{ videoUrl, videoWidth, videoHeight }}
              width={this.state.dimensions.width}
              onLoad={() => {
                this.setState({ isLoaded: true })
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
              onPress={() => Linking.openURL(`https://reddit.com${post.permalink}`)}
            />
          </InfoBox>
        </ScrollView>
        }
      </Container>
    )
  }

}

import React from 'react'
import { Linking, View, Text, Image, TouchableHighlight } from 'react-native'
import styled from 'styled-components/native'
import FitImage from 'react-native-fit-image'
import { Card, Divider } from 'react-native-material-ui'

import ThumbnailImage from '../../components/thumbnail-image'

const PostRow = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  height: 72;
  background-color: white;
`
const ListTitle = styled.Text`
  flex: 1;
  font-size: 16;
  padding-left: 16;
`

const Title = styled.Text`
  flex: 1;
  font-size: 20;
`

const Score = styled.Text`
  color: blue;
  width: 50;
`

const BigImage = styled.Image`
  flex: 1;
`

const PostContainer = styled.View`
  flex: 1;
`

const Row = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10 10;
  flex: 1;
`

const CompactPost = ({score, title, backupThumbnailUrl, thumbnailUrl, thumbnailHeight, thumbnailWidth, compact}) => (
  <PostContainer>
    <PostRow>
      <View
        style={{
          height: 50,
          width: 50,
          marginLeft: 16,
          marginRight: 16,
        }}
      >
        <ThumbnailImage {...{backupThumbnailUrl, thumbnailUrl}} />
      </View>
      <Title>{title}</Title>
    </PostRow>
    <Divider />
  </PostContainer>
)

class FullPost extends React.Component {
  state = {}

  render() {
    let {score, title, backupThumbnailUrl, thumbnailUrl, thumbnailHeight, thumbnailWidth, compact} = this.props
    let uri = this.state.imageFail ? backupThumbnailUrl : thumbnailUrl

    return (
      <PostContainer>
        <Card>
        {thumbnailHeight > 0 && this.props.dimensions &&
        <View style={{
          height: thumbnailHeight / thumbnailWidth * this.props.dimensions.width,
          width: this.props.dimensions.width,
        }}>
          <ThumbnailImage {...{backupThumbnailUrl, thumbnailUrl}} />
        </View>
        }
        <Row>
          <Score>{score}</Score>
          <Title>{title}</Title>
        </Row>
        </Card>
      </PostContainer>
    )
  }
}

export default class Post extends React.Component {
  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onPostSelected}
        style={{flex: 1}}
      >
        <View style={{flex: 1}}>
        {this.props.compact ? <CompactPost {...this.props} /> : <FullPost {...this.props} />}
        </View>
      </TouchableHighlight>
    )
  }
}

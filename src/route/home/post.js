import React from 'react'
import { View, Text, Image, TouchableHighlight } from 'react-native'
import CachedImage from 'react-native-cached-image'
import styled from 'styled-components/native'
import FitImage from 'react-native-fit-image'
import { Card } from 'react-native-material-ui'

const PostRow = styled.View`
  flex-direction: row;
  align-items: center;
  height: 60;
  background-color: white;
`

const Title = styled.Text`
  flex: 1;
  font-size: 20;
`

const Score = styled.Text`
  color: blue;
  width: 50;
`

const Thumbnail = styled.Image`
  height: 50;
  width: 100;
`

const BigImage = styled.Image`
  flex: 1;
`

const PostContainer = styled.View`
  align-items: stretch;
  flex: 1;
`

const Row = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10 10;
  flex: 1;
`

const CompactPost = ({score, title, imgUri, compact, onPostSelected}) => (
  <PostRow>
    <Score>{score}</Score>
    <Thumbnail source={{ uri: imgUri }} />
    <Title>{title}</Title>
  </PostRow>
)

class FullPost extends React.Component {
  render() {
    let {score, title, thumbnailUrl, thumbnailHeight, thumbnailWidth, compact} = this.props
    return (
      <PostContainer>
        <Card>
        {thumbnailHeight > 0 && this.props.dimensions &&
        <View style={{
          height: thumbnailHeight / thumbnailWidth * this.props.dimensions.width,
          width: this.props.dimensions.width,
        }}>
          <CachedImage 
            style={{
              flex: 1
            }} 
            source={{ uri: thumbnailUrl }} 
          />
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

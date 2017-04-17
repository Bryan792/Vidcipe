import React from 'react'
import { View, Text, Image, TouchableHighlight } from 'react-native'
import styled from 'styled-components/native'
import FitImage from 'react-native-fit-image'

const PostRow = styled.View`
  flex-direction: row;
  align-items: center;
  height: 60;
  padding: 5;
  background-color: white;
`

const Title = styled.Text`
  color: red;
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
  padding: 5;
  background-color: white;
`

const Row = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  background-color: grey;
`

const CompactPost = ({score, title, imgUri, compact, onPostSelected}) => (
  <PostRow>
    <Score>{score}</Score>
    <Thumbnail source={{ uri: imgUri }} />
    <Title>{title}</Title>
  </PostRow>
)

class FullPost extends React.Component {
  state = {}

  onLayout = event => {
    if (this.state.dimensions) return // layout was already called
    let {width, height} = event.nativeEvent.layout
    this.setState({dimensions: {width: width-10, height: height-10}})
  }
  
  render() {
    let {score, title, thumbnail, compact} = this.props
    return (
      <PostContainer 
        onLayout={this.onLayout}
      >
        {thumbnail.width && this.state.dimensions &&
        <Image 
          style={{
            height: thumbnail.height / thumbnail.width * this.state.dimensions.width,
            width: this.state.dimensions.width,
          }} 
          source={{ uri: thumbnail.url }} 
        />
        }
        <Row>
          <Score>{score}</Score>
          <Title>{title}</Title>
        </Row>
      </PostContainer>
    )
  }
}

export default class Post extends React.Component {
  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onPostSelected}
      >
        <View>
        {this.props.compact ? <CompactPost {...this.props} /> : <FullPost {...this.props} />}
        </View>
      </TouchableHighlight>
    )
  }
}

import React from 'react'
import { Linking, View, Text, Image, TouchableHighlight } from 'react-native'
import styled from 'styled-components/native'
import FitImage from 'react-native-fit-image'
import { Card, Divider } from 'react-native-material-ui'

import ThumbnailImage from '../../components/thumbnail-image'

const Title = styled.Text`
  flex: 1;
  font-size: 20;
  padding: 10 10;
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

export default class FullPost extends React.PureComponent {
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
          <Title>{title}</Title>
        </Card>
      </PostContainer>
    )
  }
}

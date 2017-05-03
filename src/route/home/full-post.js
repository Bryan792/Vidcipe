import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { Card } from 'react-native-material-ui'

import ThumbnailImage from '../../components/thumbnail-image'

const Title = styled.Text`
  flex: 1;
  font-size: 18;
  padding: 10 10;
  color: black;
`

const PostContainer = styled.View`
  flex: 1;
`

export default class FullPost extends React.PureComponent {
  state = {}

  render() {
    let { title, backupThumbnailUrl, thumbnailUrl, thumbnailHeight, thumbnailWidth } = this.props

    return this.props.dimensions ? (
      <PostContainer>
        <Card>
          {thumbnailHeight > 0 && this.props.dimensions &&
          <View
            style={{
              height: thumbnailHeight / thumbnailWidth * this.props.dimensions.width,
              width: this.props.dimensions.width,
            }}
          >
            <ThumbnailImage {...{ backupThumbnailUrl, thumbnailUrl }} />
          </View>
          }
          <Title>{title}</Title>
        </Card>
      </PostContainer>
    ) : null
  }
}

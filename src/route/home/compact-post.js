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

const Title = styled.Text`
  flex: 1;
  font-size: 16;
`

const PostContainer = styled.View`
  flex: 1;
`

export default ({score, title, backupThumbnailUrl, thumbnailUrl, thumbnailHeight, thumbnailWidth, compact}) => (
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
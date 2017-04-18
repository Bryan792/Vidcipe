import React from 'react'
import CachedImage from 'react-native-cached-image'

export default class ThumbnailImage extends React.PureComponent {
  state = {}

  render() {
    let {backupThumbnailUrl, thumbnailUrl} = this.props
    return (
      <CachedImage
        style={{
          flex: 1,
          width: undefined,
          height: undefined,
        }}
        source={{ uri: this.state.imageFail ? backupThumbnailUrl : thumbnailUrl}}
        onError={() => this.setState({imageFail: true})}
      />
    )
  }
}

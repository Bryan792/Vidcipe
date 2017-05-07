import React from 'react'
import {
  TouchableWithoutFeedback,
} from 'react-native'
import Video from 'react-native-video'

export default class FitVideo extends React.PureComponent {
  state = {
    paused: false,
  }

  props: {
    videoUrl: string,
    videoHeight: number,
    videoWidth: number,
    onLoad: Function,
    width: number,
  }

  render() {
    const { videoUrl, videoHeight, videoWidth, onLoad, width } = this.props
    return (
      <TouchableWithoutFeedback
        onPress={() => this.setState({ paused: !this.state.paused })}
      >
        <Video
          source={{ uri: videoUrl }}
          rate={1.0}
          muted
          paused={this.state.paused}
          resizeMode="contain"
          repeat
          style={{
            height: (videoHeight / videoWidth) * width,
          }}
          onLoad={onLoad}
        />
      </TouchableWithoutFeedback>
    )
  }
}

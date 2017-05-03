import React from 'react'
import {
  View,
  TouchableHighlight,
} from 'react-native'

import CompactPost from './compact-post'
import FullPost from './full-post'

export default class Post extends React.PureComponent {
  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onPostSelected}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          {this.props.compact ?
          <CompactPost {...this.props} />
          :
          <FullPost {...this.props} />
          }
        </View>
      </TouchableHighlight>
    )
  }
}

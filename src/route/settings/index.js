import React from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native'
import { connect } from 'react-redux'
import {
  Toolbar,
  Divider,
} from 'react-native-material-ui'
import styled from 'styled-components/native'

import {
  setPostDisplay,
  unhideAllPosts,
} from '../../action/hot'

function mapStateToProps(state) {
  return {
    compact: state.hot.get('compact'),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setPostDisplay: compact => dispatch(setPostDisplay(compact)),
    unhideAllPosts: () => dispatch(unhideAllPosts()),
  }
}

const SettingsRow = styled.View`
  height: 48;
  justify-content: center;
`

const Setting = styled.Text`
  font-size: 16;
  font-weight: bold;
`

@connect(mapStateToProps, mapDispatchToProps)
export default class SettingsPage extends React.PureComponent { // eslint-disable-line
  props: {
    navigation: {
      goBack: Function,
    },
    compact: boolean,
    setPostDisplay: Function,
    unhideAllPosts: Function,
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <Toolbar
          leftElement="arrow-back"
          onLeftElementPress={() => this.props.navigation.goBack()}
          centerElement={'Settings'}
        />

        <ScrollView
          style={{
            paddingTop: 8,
            paddingHorizontal: 16,
          }}
        >
          <SettingsRow>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Setting>Compact Display</Setting>
                <Switch
                  onValueChange={value => this.props.setPostDisplay(value)}
                  value={this.props.compact}
                />
            </View>
          </SettingsRow>
          <Divider />
          <SettingsRow>
            <TouchableOpacity
              onPress={() => {
                this.props.unhideAllPosts()
                // TODO: Better alert? Snackbar? Toast?
                Alert.alert('All Posts Unhidden')
              }}
            >
              <View>
                <Setting>Restore Hidden Recipes</Setting>
              </View>
            </TouchableOpacity>
          </SettingsRow>
        </ScrollView>

      </View>
    )
  }
}

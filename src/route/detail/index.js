import React from 'react'
import { Text, View, ListView, TouchableWithoutFeedback, ScrollView, Image } from 'react-native'
import { connect } from 'react-redux';
import _ from 'lodash'
import Swiper from 'react-native-swiper';
import { Toolbar } from 'react-native-material-ui'

import realm from '../..//db-manager'
import DetailPage from './detail-page' 

import {
  loadDetail,
} from '../../action/detail'

function mapStateToProps(state) {
  return { 
    posts: state.hot.get('posts'),
    videoUri: (id) => state.detail.get(id),
    state: state.detail,
  }
}

function mapDispatchToProps(dispatch) {
  return { 
    loadDetail: (id) => dispatch(loadDetail(id)),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class DetailView extends React.Component {
  state={index: +this.props.navigation.state.params.index}

  render() {
    return (
      <View style={{flex: 1}}>
        <Toolbar
          leftElement="arrow-back"
          onLeftElementPress={() => this.props.navigation.goBack()}
          centerElement=""
        />
        <Swiper 
          loop={false} 
          style={{flex: 1}} 
          index={+this.props.navigation.state.params.index}
          onMomentumScrollEnd={(e, state, context) => {
            this.setState({index: state.index})
          }}
          onLayout={this._onLayout}
        >
          {this.props.posts
            .map(({id}, index) => (
              Math.abs(this.state.index - index) <= 3 && (
          <DetailPage
            postId={id}
            key={id}
            shouldGetVideo={this.state.index === index}
            dimensions={this.state.dimensions}
          />
              )
            )
          )}
        </Swiper>
      </View>
    )
  }

  _onLayout = event => {
    if (this.state.dimensions) return // layout was already called
    let {width, height} = event.nativeEvent.layout
    this.setState({dimensions: {width, height}})
  }
}

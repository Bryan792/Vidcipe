import React from 'react'
import { Text, View, ListView, TouchableWithoutFeedback, ScrollView, Image } from 'react-native'
import { connect } from 'react-redux';
import _ from 'lodash'
import Swiper from 'react-native-swiper';

import DetailPage from './detail-page' 

import {
  loadDetail,
} from '../../action/detail'

function mapStateToProps(state) {
  return { 
    posts: state.hot.get('posts') || [],
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
    console.log(this.state.index)
    return (
      <View style={{flex: 1}}>
        <Swiper 
          loop={false} 
          style={{flex: 1}} 
          index={+this.props.navigation.state.params.index}
          onMomentumScrollEnd={(e, state, context) => {
            this.setState({index: state.index})
          }}
          onLayout={this._onLayout}
        >
          {this.props.posts.map((rowData, index) => (
          Math.abs(this.state.index - index) <= 2 && (
          <DetailPage
            postIndex={index}
            shouldGetVideo={this.state.index === index}
            key={rowData.data.title}
            dimensions={this.state.dimensions}
          />
          )
          ))}
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

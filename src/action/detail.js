import { createAction } from 'redux-actions'
import URL from 'url-parse'

import realm from '../db-manager'

export const LOAD_DETAIL_SUCCESS = 'LOAD_DETAIL_SUCCESS'

export const loadDetailSuccess = createAction(LOAD_DETAIL_SUCCESS)

export const loadDetail = post => (dispatch) => {
  function saveVideo(videoUrl, videoWidth, videoHeight) {
    realm.write(() => {
      post.videoUrl = videoUrl
      post.videoWidth = videoWidth
      post.videoHeight = videoHeight
    })
  }

  if (post.videoUrl) return
  const id = post.id
  const url = new URL(post.url)
  switch (true) {
    case /.*gfycat.com/.test(url.hostname):
      fetch(`https://gfycat.com/cajax/get${url.pathname}`)
        .then(response => response.json())
        .then((response) => {
          saveVideo(response.gfyItem.webmUrl, +response.gfyItem.width, +response.gfyItem.height)
          dispatch(loadDetailSuccess(id))
        })
      break
    case /.*imgur.com/.test(url.hostname):
      fetch(`https://api.imgur.com/3/image${url.pathname.replace('.gifv', '')}`, {
        headers: new Headers({
          Authorization: 'Client-ID a6d31ac7b239c1d',
        }),
      })
        .then(response => response.json())
        .then((response) => {
          saveVideo(response.data.mp4, +response.data.width, +response.data.height)
          dispatch(loadDetailSuccess(id))
        })
      break
    default:
      break
  }
}

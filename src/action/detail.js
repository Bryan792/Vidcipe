import { createAction } from 'redux-actions'
import URL from 'url-parse'

export const LOAD_DETAIL_SUCCESS = 'LOAD_DETAIL_SUCCESS'

export const loadDetailSuccess = createAction(LOAD_DETAIL_SUCCESS)

export const loadDetail = (post) => (dispatch, getState) => {
  let id = post.id
  //Cache never expires
  if (getState().detail.includes(id)) return;
  let url = new URL(post.url)
  switch (url.hostname) {
    case 'gfycat.com':
      fetch(`https://gfycat.com/cajax/get${url.pathname}`)
        .then(response => response.json())
        .then(response => dispatch(loadDetailSuccess({
          id,
          videoUrl: response.gfyItem.webmUrl,
          width: response.gfyItem.width,
          height: response.gfyItem.height,
        })))
      break;
    case 'i.imgur.com':
      fetch(`https://api.imgur.com/3/image${url.pathname.replace('.gifv', '')}`, {
        headers: new Headers({
          Authorization: `Client-ID a6d31ac7b239c1d`
        })
      })
        .then(response => response.json())
        .then(response => dispatch(loadDetailSuccess({
          id,
          videoUrl: response.data.mp4,
          width: response.data.width,
          height: response.data.height,
        })))
      break;
    default:
      break;
  }
}

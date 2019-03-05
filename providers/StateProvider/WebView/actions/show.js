import { OPEN_WEBVIEW, CLOSE_WEBVIEW } from './types'

export const setCurrentUrl = url => {
  return {
    type: OPEN_WEBVIEW,
    url: url,
  }
}

export const openWebView = url => {
  console.log('open', url)
  return async (dispatch, getState) => {
    console.log('openWebview')
    dispatch(setCurrentUrl(url))
  }
}

export const closeWebView = () => {
  return (dispatch, getState) => {
    dispatch(dispatch(setCurrentUrl('')))
  }
}
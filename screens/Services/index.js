import { connect } from 'react-redux'
import Services from './ServicesComponent'
import { services } from 'providers/StateProvider/Services/actions'
import { openWebView } from 'providers/StateProvider/WebView/actions'

const mapDispatchToProps = dispatch => {
  return {
    getServices: () => {
      dispatch(services())
    },
    openWebView: (url, closeOnBack = true) => {
      dispatch(openWebView(url, closeOnBack))
    },
  }
}

const mapStateToProps = state => {
  const {
    auth: { session },
    services: { services, loading, error },
  } = state
  return {
    session,
    services,
    loading,
    error,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Services)

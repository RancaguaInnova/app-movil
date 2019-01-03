import React from 'react'
import { View, Text, Divider, Caption, Subtitle, TouchableOpacity, Row } from '@shoutem/ui'
import { Alert, ScrollView } from 'react-native'
import PropTypes from 'prop-types'
import textStyles from 'styles/texts'
import styles from './styles'
import SubHeader from 'components/SubHeader'
import Loading from 'providers/ApolloProvider/Loading'
import Error from 'providers/ApolloProvider/ApolloError'
import SectionDivider from '../../components/SectionDivider'
import { Ionicons } from '@expo/vector-icons'
import { WebBrowser } from 'expo'
import { getMeQry, servicesListQry } from 'queries'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
// import { graphql, compose } from 'react-apollo'

@withGraphQL(getMeQry, { loading: <Loading />, errorComponent: <Error /> })
@withGraphQL(servicesListQry, { loading: <Loading />, errorComponent: <Error /> })
export default class Services extends React.Component {
  static navigationOptions = {
    title: 'Servicios',
  }

  static propTypes = {
    me: PropTypes.object,
    applications: PropTypes.object,
  }

  state = {
    profile: null,
  }

  componentDidMount() {
    this.setState({
      me: this.props.me,
    })
  }

  async openApp(app) {
    try {
      if (app.applicationURL && app.applicationURL.trim() !== '' && this.props.me) {
        const finalUrl = `${app.applicationURL}?token=${this.props.me.userToken}`
        console.log('finalUrl', finalUrl)
        let result = await WebBrowser.openBrowserAsync(finalUrl)
        this.setState({ result })
      } else if (!this.props.me) {
        Alert.alert('Debe iniciar sesión para acceder al servicio')
      }
    } catch (error) {
      this.setState({ result: null })
    }
  }

  renderRow(app) {
    return (
      <TouchableOpacity key={app.name} onPress={() => this.openApp(app)}>
        <Row styleName='small'>
          <Ionicons name={app.icon} size={30} style={styles.leftIcon} />
          <View styleName='vertical'>
            <Subtitle style={textStyles.rowSubtitle}>{app.name}</Subtitle>
            <Text numberOfLines={2} style={textStyles.rowText}>
              {app.description}
            </Text>
          </View>
          <Ionicons styleName='disclosure' name='ios-arrow-forward' size={28} />
        </Row>
        <Divider styleName='line' />
      </TouchableOpacity>
    )
  }

  render() {
    const items =
      this.props.applications && this.props.applications.items ? this.props.applications.items : []
    return (
      <View style={styles.container}>
        <SubHeader view='apps' title='Seleccione el servicio' />
        <SectionDivider title='Servicios disponibles' />
        <ScrollView>{items.map(app => this.renderRow(app))}</ScrollView>
      </View>
    )
  }
}

//   graphql(getMeQry),
//   graphql(servicesListQry)
// )(Services)

import React from 'react'
import {
  ScrollView,
  View,
  Text,
  Title,
  Subtitle,
  Row,
  Divider,
  TouchableOpacity,
} from '@shoutem/ui'
import { Ionicons } from '@expo/vector-icons'
import { pageHit, event } from '/helpers/analytics'
import { NavigationEvents } from 'react-navigation'
import Identification from './Identification'
import Contact from './Contact'
import Subscriptions from './Subscriptions'
import styles from './styles'
import textStyles from 'styles/texts'
import PropTypes from 'prop-types'
import { Form } from 'simple-react-form'
import Loading from 'components/Loading'
import Button from 'components/ShoutemButton'
import LightButton from 'components/LightButton'
import autobind from 'autobind-decorator'
import { Alert } from 'react-native'
import SectionDivider from 'components/SectionDivider'
import { withNavigation } from 'react-navigation'

@withNavigation
export default class Profile extends React.Component {
  static propTypes = {
    session: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object
  }

  componentDidMount() {
    let profile = Object.assign({}, this.props.session.user.profile)
    let streetNumber = ''
    // Horrible bypass to avoid invalid data type on text input
    if (profile && profile.address && profile.address.streetNumber) {
      profile.address.streetNumber = profile.address.streetNumber.toString()
    }
    this.setState({ profile })
  }

  state = {
    section: 'identification',
    errorMessage: '',
    currentSection: 0,
    loading: false
  }

  sections = [
    {
      key: 'identification',
      name: 'Identificación',
      description: 'Ingrese sus datos Personales',
      icon: 'ios-person',
      component: Identification,
    },
    {
      key: 'contact',
      name: 'Contacto',
      description: 'Ingrese sus datos de dirección y teléfono',
      icon: 'ios-contacts',
      component: Contact,
    },
    {
      key: 'subscriptions',
      name: 'Subscripciones',
      description: 'Elige que notificaciones recibir',
      icon: 'ios-notifications',
      component: Subscriptions,
    },
  ]

  @autobind
  setCurrentSection(index) {
    this.setState({ currentSection: index })
  }

  @autobind
  async signOut() {
    try {
      this.setState({ loading: true })
      await this.props.logout(this.props.session._id)
      this.props.navigation.navigate('Home')
    } catch(error) {
      console.log('Error loging out:', error)
    }
  }

  renderLogoutButton() {
    if (this.props.session) {
      return <LightButton onPress={this.signOut} title='Cerrar Sesión' />
    }
  }

  renderErrorMessage() {
    const { error } = this.props
    if (!error) return
    return <Text style={styles.errorMessage}>{error.message}</Text>
  }

  @autobind
  async submit() {
    const { user } = this.props.session
    let userInput = Object.assign({}, {
      _id: user._id,
      emails: user.emails,
      profile: this.state.profile
    })
    try {
      const response = await this.props.updateProfile(userInput)
      event('profile_update_success', JSON.stringify(userInput))
      // if (!this.props.error) Alert.alert('Datos actualizados con éxito')
    } catch ({ response, operation, graphQLErrors, networkError }) {
    // TODO: Use this in redux actions as a helper for displaying error messages
      const errMsj = []
      const arrError = graphQLErrors || []
      arrError.forEach(err => {
        const NaNStr = 'Float cannot represent non numeric value'
        if (err.validationErrors) {
          for (let k in err.validationErrors) {
            if (err.validationErrors[k] === 'required') {
              switch (k) {
                case 'user.profile.address.streetNumber':
                  errMsj.push('Número de calle es requerido')
                  break
                case 'user.profile.address.streetName':
                  errMsj.push('Nombre de calle es requerido')
              }
            } else {
              errMsj.push('Ups!', JSON.stringify(err.validationErrors))
            }
          }
        } else if (
          err.message.indexOf(NaNStr) !== -1 &&
          err.message.indexOf('value.profile.address.streetNumber') !== -1
        ) {
          errMsj.push('El número de calle ingresado no es válido')
        } else {
          errMsj.push(err.message)
        }
      })

      const msj =
        errMsj.length > 0 ? errMsj.join(', ') : 'Ups! Ocurrio un problema al guardar los datos'
      this.setState({
        errorMessage: msj,
        loading: false,
      })
      event('profile_update_error', JSON.stringify(errMsj))
    }
  }

  @autobind
  renderArrowIcon(sectionKey) {
    if (this.state.section === sectionKey) return 'ios-arrow-dropup'
    return 'ios-arrow-dropdown'
  }

  @autobind
  renderSection(section) {
    return (
      <TouchableOpacity key={section.name}>
        <Row styleName='small'>
          <Ionicons name={section.icon} size={30} style={styles.leftIcon} />
          <View styleName='vertical'>
            {/* <Subtitle style={textStyles.rowSubtitle}>{section.name}</Subtitle> */}
            <Text numberOfLines={2} style={{ ...textStyles.rowText, paddingLeft: 5, paddingRight: 5 }}>
              {section.description}
            </Text>
          </View>
        </Row>
        <Divider styleName='line' />
        {<section.component active={true} />}
      </TouchableOpacity>
    )
  }

  @autobind
  onChange(change) {
    this.setState({ profile: change.profile })
  }

  render() {
    pageHit('profile')
    const menu = [
      { title: 'Identificación', action: () => this.setCurrentSection(0) },
      { title: 'Contacto', action: () => this.setCurrentSection(1) },
      { title: 'Subscripciones', action: () => this.setCurrentSection(2) },
    ]
    const defaultSection = this.sections[this.state.currentSection]

    if (this.props.loading) return <Loading />
    return (
      <View style={styles.container}>
        <SectionDivider title='' menu={menu} />
        <ScrollView styleNames='fill-container' style={styles.container}>
          <Form state={this.state} onChange={change => this.onChange(change)}>
            {this.renderSection(defaultSection)}
          </Form>
          {this.renderErrorMessage()}
          <Button
            loading={this.state.loading}
            onPress={this.submit}
            label='Guardar'
            iconName='save'
            style={{ marginTop: this.state.errorMessage ? 5 : 40 }}
          />
          <LightButton onPress={this.signOut} title='Cerrar Sesión' />
        </ScrollView>
      </View>
    )
  }
}

import React from 'react'
import { View, Title, Text, ScrollView } from '@shoutem/ui'
import { pageHit, event } from '/helpers/analytics'
import { withNavigation, NavigationEvents } from 'react-navigation'
import { Alert } from 'react-native'
import styles from './styles.js'
import { Form, Field } from 'simple-react-form'
import TextInput from 'components/fields/TextInput'
import autobind from 'autobind-decorator'
import PropTypes from 'prop-types'
import Button from 'components/ShoutemButton'
import {
  validateIdentifier,
  validateEmail,
  validateMinLength,
  validatePresenceOfFields,
  validateCoincidence,
  combineValidators,
} from 'helpers/validators'
const pageName = 'profile/register'

@withNavigation
export default class Register extends React.Component {
  static propTypes = {
    register: PropTypes.func.isRequired,
    session: PropTypes.object,
    navigation: PropTypes.object
  }

  state = {}

  @autobind
  focusEmail() {
    this.refs.email.refs.input.focus()
  }

  @autobind
  focusPassword() {
    this.refs.password.refs.input.focus()
  }

  @autobind
  focusConfirm() {
    this.refs.confirm.refs.input.focus()
  }

  isFormReady() {
    return this.state.email && this.state.password && this.state.confirm
  }

  validate() {
    const validateForm = combineValidators(
      validateIdentifier('profile.identifier'),
      validateEmail('email'),
      validateMinLength('password', 8),
      validateCoincidence(
        { name: 'password', label: 'Contraseña' },
        { name: 'confirm', label: 'Confirmar Contraseña' }
      ),
      validatePresenceOfFields([
        { name: 'profile.identifier', label: 'RUT' },
        { name: 'email', label: 'Email' },
        { name: 'password', label: 'Contraseña' },
        { name: 'confirm', label: 'Confirmar Contraseña' },
      ])
    )
    return validateForm(this.state)
  }

  @autobind
  async submit() {
    if (this.props.loading) {
      this.setState({ loading: true, errorMessage: null })
    }
    try {
      const { email, password, confirm, profile } = this.state
      const form = this.state
      const errorMessage = this.validate()
      if (errorMessage) {
        throw new Error(errorMessage)
      }
      const cleanEmail = email.trim().toLowerCase()
      const newUserData = {
        email: cleanEmail,
        password,
        profile,
      }

      await this.props.register(newUserData)
      Alert.alert(
        `Hemos enviado un email a ${cleanEmail}, siga las instrucciones para completar su registro`
      )
      event('registry_success', cleanEmail)
      this.setState({ loading: false, errorMessage: null })
      this.props.navigation.navigate('Home')

    } catch (error) {
      let errorMessage = ''
      const graphQLErrors = error.graphQLErrors || []
      if (graphQLErrors && graphQLErrors.length > 0) {
        const arrErrors = []
        graphQLErrors.forEach(err => {
          const errorKey = err.error
          if (err.validationErrors) {
            for (let field in err.validationErrors) {
              switch (err.validationErrors[field]) {
                case 'emailExists':
                  arrErrors.push('El email ingresado ya se encuentra registrado')
                  break
                case 'notUnique':
                  arrErrors.push('El RUT ingresado ya se encuentra registrado')
                  break
                default:
                  arrErrors.push(`[error]:${err.validationErrors[field]}`)
              }
            }
          } else {
            arrErrors.push(`[error]:${errorKey}`)
          }
        })
        errorMessage = arrErrors.join(', ')
      } else {
        errorMessage = error.message.replace('GraphQL error: ', '')
      }

      this.setState({ errorMessage })
      console.log('Error:', JSON.stringify(error))
      event('registry_error', JSON.stringify(error))
      this.setState({ loading: false })
    }
  }

  renderErrorMessage() {
    if (!this.state.errorMessage) return
    return <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
  }

  render() {
    pageHit(pageName)
    return (
      <ScrollView style={styles.container}>
        <NavigationEvents onWillFocus={payload => pageHit(pageName)} />
        <Title style={styles.title}>Crea tu cuenta:</Title>
        <Form state={this.state} onChange={changes => this.setState(changes)} style={{ flex: 1 }}>
          <View style={styles.fieldsContainer}>
            <Field
              enablesReturnKeyAutomatically
              returnKeyType='next'
              fieldName='profile.identifier'
              label='Rut'
              onSubmitEditing={this.focusEmail}
              type={TextInput}
              rut
            />
            <Field
              enablesReturnKeyAutomatically
              ref='email'
              returnKeyType='next'
              keyboardType='email-address'
              fieldName='email'
              label='Email'
              onSubmitEditing={this.focusPassword}
              type={TextInput}
            />
            <Field
              enablesReturnKeyAutomatically
              ref='password'
              secureTextEntry
              fieldName='password'
              label='Contraseña'
              returnKeyType='next'
              onSubmitEditing={this.focusConfirm}
              type={TextInput}
            />
            <Field
              enablesReturnKeyAutomatically
              ref='confirm'
              secureTextEntry
              fieldName='confirm'
              label='Confirmar contraseña'
              returnKeyType='done'
              onSubmitEditing={this.submit}
              type={TextInput}
            />
          </View>
        </Form>
        <View style={{ flex: 1 }}>
          {this.renderErrorMessage()}
          <Button
            disabled={!this.isFormReady()}
            loading={this.state.loading}
            onPress={this.submit}
            label='Crear cuenta'
          />
          <Button onPress={() => this.props.navigation.goBack()} label='Volver' color='#b22d48' />
          {/* <LightButton
            style={{ position: 'relative' }}
            onPress={() => this.props.navigation.goBack()}
            title='Volver'
          /> */}
        </View>
      </ScrollView>
    )
  }
}
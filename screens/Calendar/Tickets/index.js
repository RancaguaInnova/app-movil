import React from 'react'
import { ScrollView, Alert } from 'react-native'
import { View, TouchableOpacity, Row, Subtitle, Text, Divider, Caption } from '@shoutem/ui'
import { Ionicons } from '@expo/vector-icons'
import textStyles from '../../../styles/texts'
import styles from './styles'
import moment from '../../../helpers/date/moment'
import { WebBrowser } from 'expo'
import autobind from 'autobind-decorator'
import { getSession } from '../../../providers/ApolloProvider'

export default class Tickets extends React.Component {
  state = {
    profile: null,
    tickets: [
      /* {
        _id: 'sadadadasad',
        eventName: 'Chile vs Dinamarca',
        eventDate: '15-03-2018',
        eventLocation: {
          address: {
            streetName: 'Estadio el Teniente',
            streetNumber: '',
            city: 'Rancagua',
          },
        },
        externalUrl: 'https://google.cl',
      }, */
    ],
  }

  componentDidMount() {
    this.setState({ profile: getSession() })
  }

  onClickTicket = async ticket => {
    try {
      if (ticket.externalUrl && ticket.externalUrl.trim() !== '') {
        let url =
          ticket.externalUrl.indexOf('?') !== -1
            ? `${ticket.externalUrl}&`
            : `${ticket.externalUrl}?`
        url += `ticket=${ticket._id}`
        let result = await WebBrowser.openBrowserAsync(url)
        this.setState({ result })
      }
    } catch (error) {
      console.log('Error handling onClickItem', error)
      this.setState({ result: null })
    }
  }

  renderTicket(ticket) {
    const address =
      ticket.eventLocation && ticket.eventLocation.address ? ticket.eventLocation.address : {}
    const srtAddress = `${address.streetName || ''} ${address.streetNumber || ''}, ${address.city ||
      ''}`
    return (
      <TouchableOpacity key={ticket._id} onPress={() => this.onClickTicket(ticket)}>
        <Row styleName='small'>
          <View styleName='vertical'>
            <Subtitle style={textStyles.rowSubtitle}>{ticket.eventName}</Subtitle>
            <Text numberOfLines={2} style={textStyles.rowText}>
              {srtAddress}
            </Text>
            <Caption style={textStyles.rowCaption}>{ticket.eventDate}</Caption>
          </View>
          <Ionicons styleName='disclosure' name='ios-arrow-forward' size={28} />
        </Row>
        <Divider styleName='line' />
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          {!this.state.profile && (
            <Text styleName='h-center'>Debe iniciar sesión para visualizar sus entradas</Text>
          )}

          {this.state.tickets.length === 0 && this.state.profile ? (
            <Text styleName='h-center'>No posee entradas vigentes</Text>
          ) : this.state.profile ? (
            this.state.tickets.map(ticket => this.renderTicket(ticket))
          ) : null}
        </ScrollView>
      </View>
    )
  }
}

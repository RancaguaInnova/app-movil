import React from 'react'
import { ScrollView } from 'react-native'
import { View, Divider, Caption, Text, Icon } from '@shoutem/ui'
import styles from './styles'
import HomeOverlay from './HomeOverlay'
import NewsList from './NewsList'
import moment from '../../helpers/date/moment'
import SectionDivider from '../../components/SectionDivider'
import SubHeader from './../../components/SubHeader'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import Loading from 'providers/ApolloProvider/Loading'
import Error from 'providers/ApolloProvider/ApolloError'
import { getMeQry } from 'queries'

@withGraphQL(getMeQry, { loading: <Loading />, errorComponent: <Error /> })
export default class Home extends React.Component {
  static navigationOptions = {
    header: null,
  }

  render() {
    const title = `RANCAGUA, ${moment()
      .format('DD MMMM [DE] YYYY')
      .toUpperCase()}`
    return (
      <View style={styles.mainContainer}>
        <SubHeader
          view='home'
          title='Rancagua'
          navigation={this.props.navigation}
          me={this.props.me}
        />
        {/*  <HomeOverlay navigation={this.props.navigation} /> */}
        <SectionDivider title={title} />
        <ScrollView style={styles.container}>
          <NewsList />
        </ScrollView>
      </View>
    )
  }
}

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Layout, Text ,Icon} from '@ui-kitten/components';
import Home from 'screens/Home'
import Calendar from 'screens/Calendar'
import Services from 'screens/Services'
import Information from 'screens/Information'


const { Navigator, Screen } = createBottomTabNavigator();
const PersonIcon = (props) => (
  <Icon {...props} name='home'/>
);
const InformationIcon = (props) => (
  <Icon {...props} name='info'/>
);
const ServicesIcon = (props) => (
  <Icon {...props} name='list'/>
);
const CalendarIcon = (props) => (
  <Icon {...props} name='calendar'/>
);

const BottomTabBar = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}>
    <BottomNavigationTab title='Inicio'   icon={PersonIcon}/>
    <BottomNavigationTab title='Calendario'  icon={CalendarIcon}/>
    <BottomNavigationTab title='Servicios'  icon={ServicesIcon}/>
    <BottomNavigationTab title='Información'  icon={InformationIcon}/>

  </BottomNavigation>
);

const TabNavigator = () => (
  <Navigator tabBar={props => <BottomTabBar {...props} />}>
    <Screen name='Inicio' component={Home}/>
    <Screen name='Calendario' component={Calendar}/>
    <Screen name='Servicios' component={Services}/>
    <Screen name='Información' component={Information}/>
  </Navigator>
);

 const AppNavigator = () => (
  <NavigationContainer>
    <TabNavigator/>
  </NavigationContainer>
);

 export default  AppNavigator
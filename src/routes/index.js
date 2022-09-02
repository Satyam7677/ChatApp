import React from 'react';
import {
  NavigationContainer,
  DarkTheme,
  useNavigation,
} from '@react-navigation/native';
import AuthStack from './authStack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChatRoom from '../modules/chatRoom/screens';
import RecentChats from '../modules/chatList/screens/recentChats';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Status from '../modules/status/screens';
import Calls from '../modules/calls/screens';
import colors from '../utils/locale/colors';
import ContactList from '../modules/chatList/screens/contactList';
import {screenNames, strings} from '../utils/locale/strings';
import HomeHeader from './routeHeaders/homeHeader';
import Profile from '../modules/profile/screens';
import SafeAreaComponent from '../components/safeAreaComponent';
import Splash from '../modules/splash';



const MainStack = createNativeStackNavigator();
const TopTab = createMaterialTopTabNavigator();

const authStackOptions={headerShown: false, headerBackVisible: false}
const homeComponentOptions ={title: strings.Home, headerBackVisible: false, headerShadowVisible:true, header:HomeHeader}
const chatRoomOptions = {title: strings.Chat_Room, headerShown: false,}
const contactListOptions = {title: strings.Select_Contact, headerShadowVisible: true}
const profileOptions = {title:strings.setProfile, headerShown:false}
const homeComponentScreenOptions = {tabBarIndicatorStyle: {backgroundColor: colors.purple}}
const splashOptions = {headerShown:false}
const Route = () => {

  return (
    <SafeAreaComponent style={{flex: 1}} child={
      <NavigationContainer theme={DarkTheme}>
      <MainStack.Navigator screenOptions={{headerShown: true}} initialRouteName={screenNames.splash}>

      <MainStack.Screen
          name={screenNames.splash}
          component={Splash}
          options = {splashOptions}
          // options={authStackOptions}
        />

        <MainStack.Screen
          name={screenNames.authStack}
          component={AuthStack}
          options={authStackOptions}
        />
        <MainStack.Screen
          name={screenNames.home}
          component={HomeComponent}
          options={homeComponentOptions}
          
        />
        <MainStack.Screen
          name={screenNames.chatRoom}
          component={ChatRoom}
          options={chatRoomOptions}
        />
        <MainStack.Screen
          name={screenNames.contactList}
          component={ContactList}
          options={contactListOptions}
        />
        <MainStack.Screen name={screenNames.profile}
        component={Profile}
        options={profileOptions}
        />
      </MainStack.Navigator>
    </NavigationContainer>
    }/>
  );
};

const HomeComponent = () => {
  return (
    <TopTab.Navigator
      screenOptions={homeComponentScreenOptions}>
      <TopTab.Screen name={screenNames.chatList} component={RecentChats} />
      <TopTab.Screen name={screenNames.status} component={Status} />
      <TopTab.Screen name={screenNames.calls} component={Calls} />
    </TopTab.Navigator>
  );
};



export default Route;

import React, {useState} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import ImageComponent from '../../components/imageComponent';
import Tooltip from 'react-native-walkthrough-tooltip';
import {vh, vw} from '../../utils/dimensions';
import images from '../../utils/locale/images';
import {screenNames, strings} from '../../utils/locale/strings';
import colors from '../../utils/locale/colors';
import ViewComponent from '../../components/viewComponent';
import TextComponent from '../../components/textComponent';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { uid } from '../../reducer/rootReducer';
import { signOut } from '../../utils/commonFunctions';
import ActivityIndicatorComponent from '../../components/activityIndicator';

const HomeHeader = () => {
  const navigation = useNavigation()
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [activityIndicator, setActivityIndicator] = useState(false)
  const dispatch = useDispatch()
  const optionPress = () => {
    setOptionsVisible(true);
  };


  const signOutPress = () => {
    onClose()
    setActivityIndicator(true);
    signOut(successCallback, failureCallback)
  };

  const successCallback=()=>{
    setActivityIndicator(false);
    dispatch(uid(null))
      navigation.reset({
        index: 0,
        routes: [{name: screenNames.authStack}],
      })
  }

  const failureCallback=(code)=>{
    console.log('Signout Failure', code)
    setActivityIndicator(false);
  }

  const onClose = () => {
    setOptionsVisible(false);
  };
  return (
    <ViewComponent
      style={styles.mainView}
      child={
        <React.Fragment>
          <TextComponent style={styles.appName} text={strings.chatApp} />
          <TouchableOpacity onPress={optionPress}>
            <ImageComponent imgSrc={images.options} style={styles.imageStyle} />
          </TouchableOpacity>
          <Tooltip
            backgroundStyle={styles.tooltipBackground}
            isVisible={optionsVisible}
            placement={strings.right}
            content={
              <ViewComponent style={styles.toolTipMainView} child={
                <React.Fragment>
                <TouchableOpacity onPress={signOutPress}>
                <TextComponent style={styles.textStyle} text={strings.signOut} />
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{
                setOptionsVisible(false)
                navigation.navigate(screenNames.profile)
              }}>
                <TextComponent text={'Profile'} style={styles.textStyle} />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={signOut}>
                <TextComponent style={styles.textStyle} text={strings.settings} />
              </TouchableOpacity>
            </React.Fragment>

              }/>
               
            }
            onClose={onClose}
            contentStyle={{backgroundColor:'transparent'}}
            tooltipStyle={styles.tooltipStyle}/>
            <ActivityIndicatorComponent visible={activityIndicator} />
        </React.Fragment>
      }
    />
  );
};

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    height: vh(50),
    alignItems: 'center',
    backgroundColor: 'black',
    justifyContent: 'space-between',
    paddingHorizontal: vw(10),
  },
  appName: {color: colors.grey, fontSize: vw(20), fontWeight: 'bold'},
  tooltipStyle: {
    position: 'absolute',
    width: vw(200),
    height: vh(200),
    top: vh(50),
    padding: vw(20),
    borderWidth:1,
    backgroundColor:'#0F0F0F'
  },
  imageStyle: {height: vh(20), width: vw(20)},
  toolTipMainView:{
    justifyContent:'space-between', 
    height:'100%'
  }, 
  textStyle:{color:'white'},
  tooltipBackground:{backgroundColor:'transparent' }
});

export default HomeHeader;

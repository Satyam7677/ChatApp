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
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { uid } from '../../reducer/rootReducer';
import { signOut } from '../../utils/commonFunctions';


const HomeHeader = () => {
  const navigation = useNavigation()
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [activityIndicator, setActivityIndicator] = useState(false)
  const dispatch = useDispatch()
  const optionPress = () => {
    setOptionsVisible(true);
  };

 


  const signOutPress = () => {
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
    console.log('Error in signOut is', code)
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
            isVisible={optionsVisible}
            placement={strings.right}
            content={
              <React.Fragment>
                <TouchableOpacity onPress={signOutPress}>
                  <TextComponent text={strings.signOut} />
                </TouchableOpacity>
                <TouchableOpacity onPress={signOut}>
                  <TextComponent text={strings.settings} />
                </TouchableOpacity>
              </React.Fragment>
            }
            onClose={onClose}
            tooltipStyle={styles.tooltipStyle}/>
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
    top: vh(70),
    backgroundColor: 'white',
    padding: vw(20),
  },
  imageStyle: {height: vh(20), width: vw(20)},
});

export default HomeHeader;

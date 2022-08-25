import React, {useEffect, useState} from 'react';

import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import TextInputComponent from '../../../components/textInput';
import ButtonComponent from '../../../components/buttonComponent';
import {useDispatch, useSelector} from 'react-redux';
import {CommonActions} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import {vh, vw} from '../../../utils/dimensions';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import ImageComponent from '../../../components/imageComponent';
import images from '../../../utils/locale/images';
import ActivityIndicatorComponent from '../../../components/activityIndicator';
import ViewComponent from '../../../components/viewComponent';
import firestore from '@react-native-firebase/firestore';

import {
  keyboardTypeStrings,
  screenNames,
  strings,
} from '../../../utils/locale/strings';
import colors from '../../../utils/locale/colors';
import { uid } from '../../../reducer/rootReducer';
import { signInWithPhoneNumber } from '../../../utils/commonFunctions';



export default function Login({navigation}) {
  
  const {uidString} = useSelector(store => store.persistedReducer);
  const [phone, setPhone] = useState(null);
  const [activityIndicator, setActivityIndicator] = useState(false);

  useEffect(() => {
    if (uidString) {
        navigation.reset({
          index: 0,
          routes: [{name: screenNames.home}],
        })
  }
}, []);

  const successCallback=(confirmation)=>{
    setActivityIndicator(false)
    navigation.navigate(screenNames.otp, { phone,confirmation});
  }

  const failureCallback=()=>{
    setActivityIndicator(false)
  }

  const _onPress = async () => {
    setActivityIndicator(true);
    signInWithPhoneNumber(phone, successCallback, failureCallback)
  };

  const callbackFunc = text => {
    setPhone(text);
  };

  return (
    <ViewComponent
      style={styles.mainView}
      child={
        <KeyboardAvoidingView>
          <ViewComponent
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: vh(20),
            }}
            child={
              <ImageComponent
                imgSrc={images.chatIcon}
                style={styles.imgStyle}
              />
            }
          />

          <ViewComponent
            style={{justifyContent: 'center', alignItems: 'center'}}
            child={
              <React.Fragment>
                <TextInputComponent
                  styles={styles.textInputStyle}
                  placeholder={strings.enterPhoneNumber}
                  callbackFunc={callbackFunc}
                  keyboardType={keyboardTypeStrings.numPad}
                  maxLength={10}
                />

                <ButtonComponent
                  label={strings.submit}
                  _onPress={_onPress}
                  style={styles.buttonStyle}
                  labelColor={colors.white}
                />
              </React.Fragment>
            }
          />
          <ActivityIndicatorComponent visible={activityIndicator} />
        </KeyboardAvoidingView>
      }
    />
  );
}

const styles = StyleSheet.create({
  textInputStyle: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#FFFFFF',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: vw(20),
    color: '#FFFFFF',
    fontSize: 20,
    width: vw(249),
    height: vh(54),
    marginVertical: vh(20),
  },
  buttonStyle: {
    alignSelf: 'center',
    height: vh(44),
    width: vw(159),
    borderRadius: 20,
  },
  mainView: {
    flex: 1,
  },
  imgStyle: {
    tintColor: colors.purple,
    height:vh(100),
    width:vw(100)
  },
});

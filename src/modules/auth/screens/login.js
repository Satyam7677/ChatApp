import React, { useState} from 'react';



import TextInputComponent from '../../../components/textInput';
import ButtonComponent from '../../../components/buttonComponent';
import {useSelector} from 'react-redux';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import ImageComponent from '../../../components/imageComponent';
import images from '../../../utils/locale/images';
import ActivityIndicatorComponent from '../../../components/activityIndicator';
import ViewComponent from '../../../components/viewComponent';
import {styles} from './styles';

import {
  keyboardTypeStrings,
  screenNames,
  strings,
} from '../../../utils/locale/strings';

import {
  signInWithPhoneNumber,
  snackbarFunction,
} from '../../../utils/commonFunctions';



export default function Login({navigation}) {
  const {uidString} = useSelector(store => store.persistedReducer);
  const [phone, setPhone] = useState(null);
  const [activityIndicator, setActivityIndicator] = useState(false);


  const successCallback = confirmation => {
    setActivityIndicator(false);
    navigation.navigate(screenNames.otp, {phone, confirmation});
  };

  const failureCallback = error => {
    setActivityIndicator(false);
    snackbarFunction(error);
  };

  const _onPress = async () => {
    setActivityIndicator(true);
    signInWithPhoneNumber(phone, successCallback, failureCallback);
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
            style={styles.logoView}
            child={
              <ImageComponent
                imgSrc={images.splashImage}
                style={styles.chatImgStyle}
              />
            }
          />


          <ViewComponent
            style={styles.textInputAndButtonView}
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

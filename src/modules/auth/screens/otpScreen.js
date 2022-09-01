import React, {useState} from 'react';
import {ImageBackground, KeyboardAvoidingView} from 'react-native'
import ActivityIndicatorComponent from '../../../components/activityIndicator';
import {useDispatch, useSelector} from 'react-redux';
import {uid} from '../../../reducer/rootReducer';
import ImageComponent from '../../../components/imageComponent';
import images from '../../../utils/locale/images';
import ViewComponent from '../../../components/viewComponent';
import {keyboardTypeStrings, screenNames} from '../../../utils/locale/strings';
import {
  fireStoreFunctions,
  otpVerification,
  snackbarFunction,
} from '../../../utils/commonFunctions';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {styles} from './styles';
import auth from '@react-native-firebase/auth';

export default function Otp({route, navigation}) {
  const {phone, confirmation} = route.params;

  const [activityIndicator, setActivityIndicator] = useState(false);
  const {uidString} = useSelector(store=>store.persistedReducer)

  const dispatch = useDispatch();

  const successCallback = docId => {
    setActivityIndicator(false);
    dispatch(uid(docId));
    
    
    navigation.reset({
      index: 0,
      routes: [{name: screenNames.profile}],
    });
    setActivityIndicator(false);
  };

  const failureCallback = err => {
    setActivityIndicator(false);
    snackbarFunction(err);
  };

  const updateUserData= ( phone)=>{
    fireStoreFunctions.updateUserDetail(uidString,phone)
  }

  

  const onPress = async otp => {
    setActivityIndicator(true);
    otpVerification(otp,confirmation,phone, successCallback, failureCallback)
  };

  return (

    <ViewComponent
      style={styles.mainView}
      child={
        <React.Fragment>
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
                  <OTPInputView
                    pinCount={6}
                    onCodeFilled={code => {
                      onPress(code);
                    }}
                    autoFocusOnLoad={true}
                    style={styles.otpInputView}
                    codeInputFieldStyle={styles.otpCodeInput}
                    selectionColor={'white'}
                    keyboardType={keyboardTypeStrings.numPad}
                  />
                </React.Fragment>
              }
            />

            <ActivityIndicatorComponent visible={activityIndicator} />
          </KeyboardAvoidingView>
        </React.Fragment>
      }
    />

  );
}

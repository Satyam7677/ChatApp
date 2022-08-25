import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {CommonActions} from '@react-navigation/native';

import TextInputComponent from '../../../components/textInput';
import ButtonComponent from '../../../components/buttonComponent';

import ActivityIndicatorComponent from '../../../components/activityIndicator';
import {useDispatch} from 'react-redux';
import {uid} from '../../../reducer/rootReducer';
import {vh, vw} from '../../../utils/dimensions';
import ImageComponent from '../../../components/imageComponent';
import images from '../../../utils/locale/images';
import ViewComponent from '../../../components/viewComponent';
import { keyboardTypeStrings, screenNames } from '../../../utils/locale/strings';
import colors from '../../../utils/locale/colors';
import { otpVerification } from '../../../utils/commonFunctions';


export default function Otp({route, navigation}) {
  const { phone, confirmation} = route.params;
  const [otp, setOtp] = useState(null);
  const [activityIndicator, setActivityIndicator] = useState(false);
  const dispatch = useDispatch()

  const callbackFunc = input => {
    setOtp(input);
  };

  const successCallback=(docId)=>{
    dispatch(uid(docId));
            navigation.reset({
              index: 0,
              routes: [{name: screenNames.home}],
            })
        setActivityIndicator(false)
  }

  const failureCallback=(err)=>{
    console.log('Error is', err)
    setActivityIndicator(false);
  }

  const onPress = async () => {
    setActivityIndicator(true);
   otpVerification(otp, phone,confirmation, successCallback, failureCallback)
    
  };

  return (
    <ViewComponent
      style={styles.mainView}
      child={
        <React.Fragment>
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
                  styles={styles.otpInput}
                  placeholder={'Enter OTP'}
                  callbackFunc={callbackFunc}
                  keyboardType={keyboardTypeStrings.numPad}
                  maxLength={6}
                />

                <ButtonComponent
                  label={'CONFIRM'}
                  _onPress={onPress}
                  style={styles.buttonStyle}
                  labelColor="white"
                />
              </React.Fragment>
            }
          />

          <ActivityIndicatorComponent visible={activityIndicator} />
        </React.Fragment>
      }
    />
  );
}

const styles = StyleSheet.create({
  otpInput: {
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
    borderRadius: 20,
    height: vh(54),
    width: vw(249),
    marginTop: 10,
  },
  mainView: {
    flex: 1,
  },
  imgStyle: {
    tintColor: colors.purple,
  },
});

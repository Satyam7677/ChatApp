import {StyleSheet} from 'react-native';
import {vh, vw} from '../../../utils/dimensions';
import colors from '../../../utils/locale/colors';

export const styles = StyleSheet.create({
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

  mainView: {
    flex: 1,
  },
//   chatImgStyle: {
//     tintColor: colors.purple,
//   },

  textInputStyle: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#FFFFFF',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: vw(20),
    color: colors.white,
    fontSize: 20,
    width: vw(249),
    height: vh(54),
    marginVertical: vh(20),
  },
  buttonStyle: {
    alignSelf: 'center',
    height: vh(44),
    width: vw(159),
    borderRadius: 10,
    top:vh(100)
  },
  logoView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: vh(20),
  },
  textInputAndButtonView: {
      justifyContent: 'center',
       alignItems: 'center'},
       
       otpInputView:{width: '80%', position: 'absolute', top: vh(30)},


       otpCodeInput:{
        borderWidth: 0,
        borderBottomWidth: 1,
        color: 'white',
      }
},

);

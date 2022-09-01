import { StyleSheet } from "react-native";
import { vh,vw } from "../../../utils/dimensions";
import colors from "../../../utils/locale/colors";


 export const styles = StyleSheet.create({
        mainView: {
          flex: 1,
        },
        profileImageStyle: {
          borderRadius: vw(100),
          height: vh(170),
          width: vh(170),
          alignSelf: 'center',
        },
        cameraButtonStyle: {
          borderRadius: vw(50),
          height: vh(45),
          width: vh(45),
          backgroundColor: colors.purple,
          position: 'absolute',
          bottom: 0,
          right: vw(10),
        },
        cameraImage: {
          tintColor: colors.white,
        },
        profileImageView: {
          height: vh(170),
          width: vh(170),
          alignSelf: 'center',
          borderRadius: vw(100),
          marginTop: vh(10),
        },
        userView: {
          height: vh(90),
          flexDirection: 'row',
          overflow: 'hidden',
          alignItems: 'center',
      
          // backgroundColor:'red'
        },
        userImageStyle: {
          tintColor: colors.white,
          height: vh(25),
          width: vw(25),
          marginHorizontal: vw(12),
        },
        profileTextInputButton:{
          position:'relative',
          height:vh(30),
          width:vw(50),
          top:vh(5),
          backgroundColor:'transparent',
          color:colors.white

        },
       tooltipStyle: {
          width: '100%',
          height: vh(100),
          justifyContent: 'center',
          backgroundColor: colors.lightBlack,
        },
        okButtonPress:{
          backgroundColor:'#006FA2',
          elevation: 24,
        }
      });
      

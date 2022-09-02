import { StyleSheet, Dimensions } from "react-native";
import { vh, vw } from "../../../utils/dimensions";
import colors from "../../../utils/locale/colors";

const { width} = Dimensions.get('screen')


export const style = StyleSheet.create({
    textInputView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: 10,
    },
    textInput: {
      backgroundColor: '#CAC9C9',
      flex: 1,
      height: 40,
      borderRadius: 5,
      marginHorizontal: 10,
      width: 250,
      fontSize: 20,
      paddingHorizontal: 10,
    },
    buttonStyle: {
      backgroundColor: 'green',
      justifyContent: 'center',
      width: 100,
      height: 40,
    },
    mainView: {
      flex: 1,
    },
    messageView: {
      maxWidth: width / 1.1,
      marginVertical: 2,
      justifyContent: 'center',
      borderRadius: 17,
      height: 'auto',
      alignItems: 'center',
      minHeight: 40,
      minWidth: 60,
      marginHorizontal: 2,
      paddingHorizontal: 10,
      paddingVertical: 10,
    },
    messageStyle: {
      // backgroundColor:colors.grey,

    },
    tooltipStyle:{
      position: 'absolute',
       top: vh(50),
      backgroundColor:colors.lightBlack,
      width:vw(120)

    },
    toolTipView:{
      justifyContent:'space-between',
      height:vh(60),
      
    }
  });
  
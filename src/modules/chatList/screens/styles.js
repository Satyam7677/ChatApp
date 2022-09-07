import { StyleSheet } from "react-native";
import { vh,vw } from "../../../utils/dimensions";
import colors from "../../../utils/locale/colors";

export const styles = StyleSheet.create({
    button: {
      backgroundColor: colors.purple,
      width: '50%',
      height: '5%',
      borderRadius: 10,
      alignSelf: 'center',
    },
    mainView: {
      flex: 1,
    },
    imageStyle: {
      borderRadius: vw(50),
      height: vh(50),
      width: vw(50),
      marginRight: vw(20),
    },
    renderItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: vh(10),
      paddingHorizontal: vw(10),
    },
    contactButton: {
      borderRadius: 50,
      width: vw(50),
      height: vw(50),
      position: 'absolute',
      right: vw(10),
      bottom: vh(50),
    },
    lastMessageText:{color: colors.white,fontSize:vw(10)},
    alluserListView:{height: '90%'},
    nameTimeView:
    {  flexDirection:'row',justifyContent:'space-between'},
    name:{
      color:colors.white,
      width:vw(100),
      marginRight:vw(5),
      fontSize:vw(20)
    },
    time:{
      width:vw(100),
      color:colors.white
    },
    recentChatFlatListView:{height: '90%'}
    
  });
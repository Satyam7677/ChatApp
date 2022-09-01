import { StyleSheet, Text, View , TouchableOpacity} from 'react-native'
import React from 'react'
import ImageComponent from './imageComponent'
import TextComponent from './textComponent'
import colors from '../utils/locale/colors'
import { vh, vw } from '../utils/dimensions'



export default function ButtonComponent({label,imgSrc,imageStyle, _onPress,...rest}) {
    const {style, labelStyle,  uri}= rest
  return (
   <TouchableOpacity style={[styles.defaultButton,style]} onPress={_onPress}>
       {imgSrc && <ImageComponent imgSrc={imgSrc} uri={{uri}} source={imgSrc | uri} style={[styles.imgStyle, imageStyle]}/>}
      {label && <TextComponent style={[styles.defaultText, labelStyle]} text={label}/>}
   </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    defaultButton:{
        backgroundColor:colors.purple,
        width:vw(200),
        height:vh(50),
        justifyContent:'center',
        alignItems:'center',
        borderRadius:vw(10),
        overflow:'hidden',
        alignSelf:'center',
        position:'absolute',
        bottom:vh(30)

        
    },
    defaultText:{
        color:colors.white,
        fontSize:30,
        fontWeight:'500',
    },
    imgStyle:{
        resizeMode:'cover',
        height:'50%',
        width:'50%',


    }
})
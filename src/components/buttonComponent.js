import { StyleSheet, Text, View , TouchableOpacity} from 'react-native'
import React from 'react'
import ImageComponent from './imageComponent'
import TextComponent from './textComponent'
import colors from '../utils/locale/colors'


export default function ButtonComponent({label,imgSrc,imageStyle, _onPress,...rest}) {
    const {style, labelColor,  uri}= rest
  return (
   <TouchableOpacity style={[styles.defaultButton,style]} onPress={_onPress}>
       {imgSrc && <ImageComponent imgSrc={imgSrc} uri={{uri}} source={imgSrc | uri} style={[styles.imgStyle, imageStyle]}/>}
      {label && <TextComponent style={[styles.defaultText, {color:labelColor}]} text={label}/>}
   </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    defaultButton:{
        backgroundColor:colors.purple,
        width:70,
        height:30,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        overflow:'hidden',
    },
    defaultText:{
        color:'black',
        fontSize:30,
        fontWeight:'500',
    },
    imgStyle:{
        resizeMode:'cover',
        height:'50%',
        width:'50%',


    }
})
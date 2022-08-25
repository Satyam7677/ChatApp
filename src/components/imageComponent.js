import { StyleSheet, Text, View ,Image} from 'react-native'
import React from 'react'
import { vh, vw } from '../utils/dimensions'
import images from '../utils/locale/images'

export default function ImageComponent({imgSrc,style,...rest}) {
    const {uri} = rest
  return (
    <React.Fragment>
    <Image defaultSource={images.whiteImage} source={imgSrc || uri} style={[styles.imgStyle, style]} />
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
    imgStyle:{
        height:vh(200),
        width:vw(200),
        resizeMode:'cover',    }
})
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import images from '../utils/locale/images'
export default function FastImageComponent({styles, imgSrc,...rest}) {
    const {uri} = rest
  return (
    <FastImage
    source={imgSrc || {uri:uri}}
    style={styles}
    defaultSource={images.whiteImage}
    />
  )
}

const styles = StyleSheet.create({})
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function TextComponent({text, style,...rest}) {
  const {numberOfLines, ellipsizeMode} = rest
  return (
    <React.Fragment>
    <Text numberOfLines={numberOfLines} ellipsizeMode={ellipsizeMode} style={style}>
        {text}
    </Text>
    </React.Fragment>
  )
}


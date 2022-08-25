import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function TextComponent({text, style}) {
  return (
    <React.Fragment>
    <Text style={style}>
        {text}
    </Text>
    </React.Fragment>
  )
}


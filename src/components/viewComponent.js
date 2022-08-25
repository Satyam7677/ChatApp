import { StyleSheet, View } from 'react-native'
import React from 'react'

export default function ViewComponent({child, style}) {
  return (
      <View style={style}>
  {child}
  </View>
  )
}


import { SafeAreaView} from 'react-native'
import React from 'react'

export default function SafeAreaComponent({style, child}) {
  return (
    <SafeAreaView style={style}>
      {child}
    </SafeAreaView>
  )
}


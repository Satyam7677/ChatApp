import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../../../utils/locale/colors'

export default function Calls() {
  return (
    <View>
      <Text style={styles.text}>Calls</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    text:{
        color:colors.white
    }
})
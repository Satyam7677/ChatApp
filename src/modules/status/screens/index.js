import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../../../utils/locale/colors'

export default function Status() {
  return (
    <View>
      <Text style={styles.text}>Status</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    text:{
        color:colors.white
    }
})
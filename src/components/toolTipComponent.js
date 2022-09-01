import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Tooltip from 'react-native-walkthrough-tooltip'
import ViewComponent from './viewComponent'


export default function ToolTipComponent(visible,content) {
  return (
   <Tooltip isVisible={visible} content={
       content
   } />

  )
}

const styles = StyleSheet.create({})
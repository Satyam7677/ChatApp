import {TextInput } from 'react-native'
import React from 'react'
import colors from '../utils/locale/colors'


const TextInputComponent = React.forwardRef(({placeholder,onSubmitEditing,value,callbackFunc,...rest}, ref) =>{
const {maxLength,contentType,keyboardType, styles, onFocus}= rest

    const _setText=(str)=>{
            callbackFunc(str)
    }
    const _setFocus=()=>{
        onFocus(ref)
    }
  return (
    <React.Fragment>
        <TextInput
        // ref={ref}
        style={styles}
        placeholder={placeholder}
        onChangeText={_setText}
        maxLength={maxLength}
        value={value}
        textContentType={contentType}
        // onSubmitEditing={onSubmitEditing}
        placeholderTextColor={colors.white}
        keyboardType={keyboardType}
        // onFocus={_setFocus}
        />
        </React.Fragment>
  
  )
})

export default TextInputComponent
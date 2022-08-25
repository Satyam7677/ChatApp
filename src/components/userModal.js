import { StyleSheet, Text , Modal, SafeAreaView} from 'react-native'
import React,{useEffect, useState} from 'react'
import TextInputComponent from './textInput'
import ButtonComponent from './buttonComponent'
import { useDispatch } from 'react-redux'
import firestore from '@react-native-firebase/firestore';

export default function UserModal({visible, callbackFunc,...rest}) {


    const {header} = rest
    useEffect(()=>{
        firestore().collection('Users').get().then(
            res=>{
                console.log('res is', res.docs)
            }
        )
    },[])


    const [text, setText] = useState(
        {
            name:'',
            phoneNumber:''
        }
    )
    const _nameCallback=(txt)=>{
        setText({
            ...text, name:txt
        })
    }

    const _phoneCallback=(txt)=>{
        setText({
            ...text, phoneNumber:txt
        })
    }

    const _onPress = ()=>{
       callbackFunc(false, text)

    }
  return (
   
      <Modal visible={visible}>
     <SafeAreaView style={styles.safeAreaStyle}>
         <Text style={styles.headerText}>{'ADD USER'}</Text>
        <TextInputComponent
            placeholder={'Name'}
            value={text.name}
            callbackFunc={_nameCallback}
            styles={styles.nameTextInput}
            
        />
        <TextInputComponent
            placeholder={'Phone Number'}
            value={text.phoneNumber}
            callbackFunc={_phoneCallback}
            styles={styles.nameTextInput}
            
        />
        <ButtonComponent label={'OK'} _onPress={_onPress} labelColor={'white'} style={styles.buttonStyle}/>
        </SafeAreaView>
    </Modal>

  )
}

const styles = StyleSheet.create({
    buttonStyle:{
        height:40,
        width:70,
        backgroundColor:'green'
    },
    safeAreaStyle:{
        alignItems:'center',
    },
    nameTextInput:{
        height:50,
        width:200,
        borderWidth:1,
        borderRadius:10,
        margin:10,
        paddingHorizontal:10,
    },
    headerText:{

    }
    
})
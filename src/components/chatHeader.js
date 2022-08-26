import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useEffect, useState } from 'react';
import ViewComponent from './viewComponent';
import TextComponent from './textComponent';
import {vh, vw} from '../utils/dimensions';
import ImageComponent from './imageComponent';
import images from '../utils/locale/images';
import colors from '../utils/locale/colors';
import firestore from '@react-native-firebase/firestore';

export default function ChatHeader({head,id, backCallback}) {
  const [online, setOnline] = useState(null)
  useEffect(()=>{
    const subscribe=firestore().collection('Users').doc(id).onSnapshot(
      snapshot=>{
        setOnline(snapshot.data().online)
      }
    )
    return ()=>subscribe()
  },[])
  return (
    <ViewComponent
      style={styles.mainView}
      child={
        <React.Fragment>
          <TouchableOpacity style={styles.backView} onPress={()=>{backCallback()}}>
            <ImageComponent imgSrc={images.back} style={styles.icon} />
          </TouchableOpacity>
          <TextComponent style={styles.head} text={`${head}  ${online=='active'?'online':'offline'}`} />
          <TouchableOpacity style={styles.callView}>
            <ImageComponent imgSrc={images.call} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.callView}>
            <ImageComponent imgSrc={images.videoCall} style={styles.icon} />
          </TouchableOpacity>
        </React.Fragment>
      }
    />
  );
}

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal:vw(10),
    height:vh(30)
  },
  head: {
    color: 'white',
    fontSize: vw(22),
  },
  icon: {
    tintColor: colors.purple,
    height: vh(15),
    width: vw(15),

  },
  backView: {
      marginRight:vw(70)
  },
  callView:{
      marginLeft:vw(55)
  }
});

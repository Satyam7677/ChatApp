import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import ImageComponent from '../../../components/imageComponent';
import images from '../../../utils/locale/images';
import {vh, vw} from '../../../utils/dimensions';
import ImagePicker from 'react-native-image-crop-picker';
import ButtonComponent from '../../../components/buttonComponent';
import colors from '../../../utils/locale/colors';
import ViewComponent from '../../../components/viewComponent';
import TextComponent from '../../../components/textComponent';
import { useSelector } from 'react-redux';

export default function Profile() {
  const [img, setImg] = useState(null);
  const {uidString}=useSelector((store)=>store.persistedReducer)
  console.log('uidString',uidString)
  const cameraPress = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        console.log('image',image)
        Platform.OS == 'ios' ? setImg(image.sourceURL) : setImg(image.path);
      })
      .catch(err => {
        console.log('The error in image picker ', err);
      });
  };
  return (
    <ViewComponent
      style={styles.mainView}
      child={
        <React.Fragment>
          <TouchableOpacity
            style={styles.profileImageView}
            onPress={cameraPress}
            activeOpacity={0.6}>
            <ImageComponent uri={{uri: img}} style={styles.profileImageStyle} />
            <ButtonComponent
              _onPress={cameraPress}
              imgSrc={images.camera}
              style={styles.cameraButtonStyle}
              imageStyle={styles.cameraImage}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.userView}>
            <ImageComponent
              imgSrc={images.user}
              style={styles.userImageStyle}
            />
            <ViewComponent
              style={{
                borderBottomColor: colors.grey,
                width: '70%',
                borderBottomWidth: 0.25,
              }}
              child={
                <React.Fragment>
                  <TextComponent text={'Name'} style={{color: colors.grey}} />
                  <TextComponent text={'Saa'} style={{color: colors.white, textWeight:'100'}} />
                  <TextComponent
                    text={'This username is visible to other users'}
                    style={{color: colors.grey}}
                  />
                </React.Fragment>
              }
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.userView}>
            <ImageComponent
              imgSrc={images.info}
              style={styles.userImageStyle}
            />
            <ViewComponent
              style={{
                borderBottomColor: colors.grey,
                width: '70%',
                borderBottomWidth: 0.25,
              }}
              child={
                <React.Fragment>
                  <TextComponent text={'About'} style={{color: colors.grey}} />
                  <TextComponent text={'Saa'} style={{color: colors.white, textWeight:'100'}} />
                  <TextComponent
                    text={'About is this'}
                    style={{color: colors.grey}}
                  />
                </React.Fragment>
              }
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.userView}>
            <ImageComponent
              imgSrc={images.call}
              style={styles.userImageStyle}
            />
            <ViewComponent
              style={{
                borderBottomColor: colors.grey,
                width: '70%',
                // borderBottomWidth: 0.25,
              }}
              child={
                <React.Fragment>
                  <TextComponent text={'Phone'} style={{color: colors.grey}} />
                  <TextComponent text={'+917666627728'} style={{color: colors.white, textWeight:'100'}} />
                </React.Fragment>
              }
            />
          </TouchableOpacity>
        </React.Fragment>
      }
    />
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  profileImageStyle: {
    borderRadius: vw(100),
    height: vh(170),
    width: vh(170),
    alignSelf: 'center',
  },
  cameraButtonStyle: {
    borderRadius: vw(50),
    height: vh(45),
    width: vh(45),
    backgroundColor: colors.purple,
    position: 'absolute',
    bottom: 0,
    right: vw(10),
  },
  cameraImage: {
    tintColor: colors.white,
  },
  profileImageView: {
    height: vh(170),
    width: vh(170),
    alignSelf: 'center',
    borderRadius: vw(100),
    marginTop: vh(10),
  },
  userView: {
    height: vh(90),
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',

    // backgroundColor:'red'
  },
  userImageStyle: {
    tintColor: colors.white,
    height: vh(25),
    width: vw(25),
    marginHorizontal: vw(12),
  },
});

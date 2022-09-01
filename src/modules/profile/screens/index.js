import {Platform, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import ImageComponent from '../../../components/imageComponent';
import images from '../../../utils/locale/images';
import {vh, vw} from '../../../utils/dimensions';
import ButtonComponent from '../../../components/buttonComponent';
import colors from '../../../utils/locale/colors';
import ViewComponent from '../../../components/viewComponent';
import TextComponent from '../../../components/textComponent';
import {useDispatch, useSelector} from 'react-redux';
import Tooltip from 'react-native-walkthrough-tooltip';
import TextInputComponent from '../../../components/textInput';
import {
  fireStoreFunctions,
  imagePickerFunction,
} from '../../../utils/commonFunctions';
import {userDataReducer} from '../../../reducer/rootReducer';
import {useNavigation} from '@react-navigation/native';
import {screenNames} from '../../../utils/locale/strings';
import { styles } from './styles';

export default function Profile() {
  const [img, setImg] = useState(null);
  const {uidString, userData} = useSelector(store => store.persistedReducer);
  const dispatch = useDispatch();
  const [toolTipVisible, setToolTipVisible] = useState(false);
  const [text, setText] = useState(null);
  const [toolTipFor, setToolTipFor] = useState(null);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    fireStoreFunctions.getUserData(
      uidString,
      userDataSuccessCallback,
      userDataFailureCallback,
    );
  }, [toolTipVisible]);

  // useEffect(()=>{

  // },[])

  const userDataSuccessCallback = data => {
    dispatch(userDataReducer(data));
  };

  const cameraPress = () => {
    imagePickerFunction(imagePickerSuccessCallback, imagePickerFailureCallback);
  };

  const imagePickerSuccessCallback = (imageURL, imagePath) => {
    Platform.OS == 'ios' ? setImg(imageURL) : setImg(imagePath);
  };

  const setTextCallback = str => {
    setText(str);
  };

  const commonToolTipOk = () => {
    toolTipFor == 'Name'
      ? fireStoreFunctions.setUserName(uidString, text)
      : fireStoreFunctions.setAbout(uidString, text);
    setToolTipVisible(false);
  };

  const okButtonPress = () => {
    navigation.reset({
      index: 0,
      routes: [{name: screenNames.home}],
    });
  };

  const tooltip = () => {
    return (
      <Tooltip
        isVisible={toolTipVisible}
        content={
          <ViewComponent
            child={
              <React.Fragment>
                <TextInputComponent
                  styles={{color:'white'}}
                  callbackFunc={setTextCallback}
                  value={text}
                  placeholder={toolTipFor==='Name'?'Enter name': 'Enter About'}
                />
                <ButtonComponent
                  label={'Ok'}
                  style={styles.profileTextInputButton}
                  _onPress={() => {
                    commonToolTipOk();
                  }}
                />
              </React.Fragment>
            }
          />
        }
        onClose={() => {
          setToolTipVisible(false);
        }}
        contentStyle={{backgroundColor: 'transparent'}}
        tooltipStyle={styles.tooltipStyle}
      />
    );
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
          <TouchableOpacity
            style={styles.userView}
            onPress={() => {
              setToolTipFor('Name');
              setToolTipVisible(true);
            }}>
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
                  <TextComponent
                    text={userData?.name}
                    style={{color: colors.white, textWeight: '100'}}
                  />
                  <TextComponent
                    text={'This username is visible to other users'}
                    style={{color: colors.grey}}
                  />
                </React.Fragment>
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.userView}
            onPress={() => {
              setToolTipFor('About');
              setToolTipVisible(true);
            }}>
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
                  <TextComponent
                    text={userData?.about}
                    style={{color: colors.white, textWeight: '100'}}
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
                  <TextComponent
                    text={`+91${userData?.phone}`}
                    style={{color: colors.white, textWeight: '100'}}
                  />
                </React.Fragment>
              }
            />
          </TouchableOpacity>

          <ButtonComponent style={styles.okButtonPress} label={'Ok'} _onPress={okButtonPress} />
          {tooltip(toolTipVisible)}
        </React.Fragment>
      }
    />
  );
}

const imagePickerFailureCallback = err => {
  console.log('Image picker error', err);
};

const userDataFailureCallback = () => {
  console.log('Error', err);
};


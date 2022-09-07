import {Platform, TouchableOpacity} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import ImageComponent from '../../../components/imageComponent';
import images from '../../../utils/locale/images';
import ButtonComponent from '../../../components/buttonComponent';
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
import { strings} from '../../../utils/locale/strings';
import {styles} from './styles';

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

  const userDataSuccessCallback = data => {
    dispatch(userDataReducer(data));
  };

  const cameraPress = () => {
    imagePickerFunction(imagePickerSuccessCallback, imagePickerFailureCallback);
  };

  const imagePickerSuccessCallback = (imageURL, imagePath) => {
    Platform.OS == strings.ios ? setImg(imageURL) : setImg(imagePath);
  };

  const setTextCallback = str => {
    setText(str);
  };

  const commonToolTipOk = () => {
    toolTipFor == strings.name
      ? fireStoreFunctions.setUserName(uidString, text)
      : fireStoreFunctions.setAbout(uidString, text);
    setToolTipVisible(false);
  };

  const okButtonPress = () => {
    navigation.popToTop();
  };

  const tooltip = () => {
    return (
      <Tooltip
        isVisible={toolTipVisible}
        content={
          <ViewComponent
          style={styles.tooltipView}
            child={
              <React.Fragment>
                <TextInputComponent
                  styles={styles.userInput}
                  callbackFunc={setTextCallback}
                  value={text}
                  placeholder={
                    toolTipFor === strings.name
                      ? strings.enterName
                      : strings.enterAbout
                  }
                />
                 <TouchableOpacity style={styles.tooltipOk} onPress={commonToolTipOk}>
            <TextComponent text={strings.ok} style={styles.userInput}/>
          </TouchableOpacity>
              </React.Fragment>
            }
          />
        }
        onClose={() => {
          setToolTipVisible(false);
        }}
        contentStyle={styles.tooltipContentStyle}
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
              setToolTipFor(strings.name);
              setToolTipVisible(true);
            }}>
            <ImageComponent
              imgSrc={images.user}
              style={styles.userImageStyle}
            />
            <ViewComponent
              style={styles.nameView}
              child={
                <React.Fragment>
                  <TextComponent text={strings.name} style={styles.nameText} />
                  <TextComponent
                    text={userData?.name}
                    style={styles.userInput}
                  />
                  <TextComponent
                    text={strings.userNameVisibleToOthers}
                    style={styles.nameText}
                  />
                </React.Fragment>
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.userView}
            onPress={() => {
              setToolTipFor(strings.about);
              setToolTipVisible(true);
            }}>
            <ImageComponent
              imgSrc={images.info}
              style={styles.userImageStyle}
            />
            <ViewComponent
              style={styles.aboutView}
              child={
                <React.Fragment>
                  <TextComponent text={strings.about} style={styles.nameText} />
                  <TextComponent
                    text={userData?.about}
                    style={styles.userInput}
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
              style={styles.phoneView}
              child={
                <React.Fragment>
                  <TextComponent text={strings.phone} style={styles.nameText} />
                  <TextComponent
                    text={`+91${userData?.phone}`}
                    style={styles.userInput}
                  />
                </React.Fragment>
              }
            />
          </TouchableOpacity>

          <ButtonComponent
            style={styles.okButtonPress}
            label={strings.ok}
            _onPress={okButtonPress}
          />
         
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

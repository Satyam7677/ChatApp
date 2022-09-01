import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import ViewComponent from './viewComponent';
import TextComponent from './textComponent';
import {vh, vw} from '../utils/dimensions';
import ImageComponent from './imageComponent';
import images from '../utils/locale/images';
import colors from '../utils/locale/colors';
import {fireStoreFunctions} from '../utils/commonFunctions';
import {strings} from '../utils/locale/strings';

export default function ChatHeader({
  head,
  id,
  uid,
  backCallback,
  toolTipCallback,
}) {
  const [online, setOnline] = useState(null);
  useEffect(() => {
    const subscribe = fireStoreFunctions.checkOnline(id, onlineCallback);
    return subscribe;
  }, []);

  const onlineCallback = bool => {
    setOnline(bool);
  };

  // const blockUser = () => {
  //   fireStoreFunctions.blockUser(uid, id, true);
  // };

  // const unBlockUser = () => {
  //   fireStoreFunctions.unblockUser(uid, id);
  // };

  return (
    <ViewComponent
      style={styles.mainView}
      child={
        <React.Fragment>
          <TouchableOpacity style={styles.backView} onPress={backCallback}>
            <ImageComponent imgSrc={images.back} style={styles.icon} />
          </TouchableOpacity>
          <ViewComponent
            style={styles.nameAndOnlineView}
            child={
              <React.Fragment>
                <TextComponent style={styles.head} text={`${head} `} />
                <TextComponent
                  style={[
                    {color: online == 'online' ? 'green' : 'grey'},
                    styles.onlineText,
                  ]}
                  text={
                    online
                  }
                />
              </React.Fragment>
            }
          />

          <ViewComponent
            style={styles.optionsView}
            child={
              <React.Fragment>
                <TouchableOpacity style={styles.callView}>
                  <ImageComponent imgSrc={images.call} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.callView}>
                  <ImageComponent
                    imgSrc={images.videoCall}
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.callView}
                  onPress={toolTipCallback}>
                  <ImageComponent imgSrc={images.options} style={styles.icon} />
                </TouchableOpacity>
              </React.Fragment>
            }
          />
        </React.Fragment>
      }
    />
  );
}

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: vw(10),
    height: vh(40),
  },
  head: {
    color: colors.white,
    fontSize: vw(22),
  },
  icon: {
    tintColor: colors.purple,
    height: vh(15),
    width: vw(15),
  },
  backView: {
    marginRight: vw(20),
  },
  onlineText: {fontSize: vw(10)},
  nameAndOnlineView: {
    width: vw(150),
  },
  optionsView: {
    marginLeft: vw(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: vw(150),
  },
});

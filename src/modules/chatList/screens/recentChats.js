import {TouchableOpacity, FlatList, AppState} from 'react-native';
import React, {useEffect, useState, useRef, useMemo} from 'react';
import ButtonComponent from '../../../components/buttonComponent';
import {recentUserReducer} from '../../../reducer/rootReducer';
import {useDispatch, useSelector} from 'react-redux';
import ImageComponent from '../../../components/imageComponent';
import images from '../../../utils/locale/images';
import TextComponent from '../../../components/textComponent';
import SafeAreaComponent from '../../../components/safeAreaComponent';
import ViewComponent from '../../../components/viewComponent';
import {fireStoreFunctions} from '../../../utils/commonFunctions';
import {styles} from './styles';
import { screenNames, strings } from '../../../utils/locale/strings';


export default function RecentChats({navigation}) {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const dispatch = useDispatch();
  const {uidString, recentUsers} = useSelector(store => store.persistedReducer);

  useEffect(() => {
    const subscriber = fireStoreFunctions.checkRecentInbox(
      uidString,
      'RecentUsers',
      snapShotCallBack,
    );
    return subscriber;
  }, []);

  const snapShotCallBack = data => {
    dispatch(recentUserReducer(data));
  };

  useEffect(() => {
    userOnlineUpdate();
    const subscription = AppState.addEventListener(strings.change, nextAppState => {
      appState.current = nextAppState;
      userOnlineUpdate();
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const userOnlineUpdate = () => {
    const currrentState = appState.current;
    const cState =
      currrentState == strings.active
        ? strings.online
        : `last seen at ${new Date().getHours()} : ${new Date().getMinutes()}`;
    setAppStateVisible(cState);
    fireStoreFunctions.updateOnlineState(uidString, cState);
  };

  const _renderItem = ({item}) => {
    const id = item?.data()?.id;
    const name = item?.data()?.name;
    const lastMessage = item?.data()?.lastMessage;
    const phone = item?.data()?.phone;

    return (
      <React.Fragment>
        <TouchableOpacity
          style={styles.renderItem}
          onPress={() => {
            _userItemPress(id, phone, name);
          }}>
          <ImageComponent style={styles.imageStyle} />

          <ViewComponent
            style={styles.recentChatinfo}
            child={
              <React.Fragment>
                <ViewComponent
                  style={styles.nameTimeView}
                  child={
                    <React.Fragment>
                      <TextComponent style={styles.name} text={name} />
                    </React.Fragment>
                  }
                />

                <TextComponent
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={styles.lastMessageText}
                  text={lastMessage}
                />
              </React.Fragment>
            }
          />
        </TouchableOpacity>
      </React.Fragment>
    );
  };

  const _contactPress = () => {
    navigation.push(screenNames.contactList);
  };

  const _userItemPress = (userId, phoneNum, name) => {
    const roomId = userId < uidString ? userId + uidString : uidString + userId;
    navigation.navigate(strings.chatRoom, {roomId, userId, phoneNum, name});
  };

  const button = useMemo(
    () => (
      <ButtonComponent
        imgSrc={images.chatIcon}
        _onPress={_contactPress}
        style={styles.contactButton}
      />
    ),
    [],
  );

  return (
    <SafeAreaComponent
      style={styles.mainView}
      child={
        <React.Fragment>
          <ViewComponent
            style={styles.recentChatFlatListView}
            child={
              <FlatList
                data={recentUsers}
                renderItem={_renderItem}
                bounces={false}
              />
            }
          />
          {button}
        </React.Fragment>
      }
    />
  );
}

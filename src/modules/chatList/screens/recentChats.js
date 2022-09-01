import {TouchableOpacity, FlatList, AppState} from 'react-native';
import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import ButtonComponent from '../../../components/buttonComponent';
import {recentUserReducer} from '../../../reducer/rootReducer';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../../utils/locale/colors';
import ImageComponent from '../../../components/imageComponent';
import images from '../../../utils/locale/images';
import TextComponent from '../../../components/textComponent';
import SafeAreaComponent from '../../../components/safeAreaComponent';
import ViewComponent from '../../../components/viewComponent';
import {fireStoreFunctions} from '../../../utils/commonFunctions';
import {styles} from './styles';

// import { NavigationActions, StackActions } from 'react-navigation';

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
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      userOnlineUpdate();
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const userOnlineUpdate = () => {
    const currrentState = appState.current;
   const cState= currrentState=='active'?'online':`last seen at ${new Date().getHours()} : ${new Date().getMinutes()}`

    setAppStateVisible(cState);
    fireStoreFunctions.updateOnlineState(uidString, cState);
  };

  const _renderItem = ({item}) => {
    const lastMsgDate = new Date(item.data().createdAt).toJSON();
    const id = item?.data()?.id;
    const name = item?.data()?.name;
    const lastMessage = item?.data()?.lastMessage;
    const phone = item?.data()?.phone;

    return (
      <React.Fragment>
        <TouchableOpacity
          style={styles.renderItem}
          onPress={() => {
            _userItemPress(id,  phone,name);
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

                      {/* <TextComponent
                        numberOfLines={1}
                        style={styles.time}
                        text={lastMsgDate}
                      /> */}
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
    navigation.push('contactList');
  };

  const _userItemPress = (userId,phoneNum, name ) => {
    console.log('userId,phoneNum, name ',userId,phoneNum, name )
    const roomId = userId < uidString ? userId + uidString : uidString + userId;
    navigation.navigate('chatRoom', {roomId, userId,phoneNum, name});
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
            style={{height: '90%'}}
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

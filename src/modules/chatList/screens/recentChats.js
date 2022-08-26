import {StyleSheet, TouchableOpacity, FlatList, AppState} from 'react-native';
import React, {useEffect, useLayoutEffect, useState, useRef} from 'react';
import ButtonComponent from '../../../components/buttonComponent';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {recentUserReducer, blockReducer} from '../../../reducer/rootReducer';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../../utils/locale/colors';
import ImageComponent from '../../../components/imageComponent';
import images from '../../../utils/locale/images';
import {vh, vw} from '../../../utils/dimensions';
import TextComponent from '../../../components/textComponent';
import SafeAreaComponent from '../../../components/safeAreaComponent';
import ViewComponent from '../../../components/viewComponent';

// import { NavigationActions, StackActions } from 'react-navigation';

export default function RecentChats({navigation}) {
  const [activityIndicator, setActivityIndicator] = useState(false);
  const [userModalVisible, setUserModalVisble] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const dispatch = useDispatch();
  const {uidString, recentUsers, blockList} = useSelector(
    store => store.persistedReducer,
  );

  useEffect(() => {
    firestore()
      .collection('Users')
      .doc(uidString)
      .collection('BlockList')
      .get()
      .then(res => {
        console.log('Response after getting blockList', res);
        const blockArray = res.docs.map(x => x.data().isBlocked);
        console.log('BlockArray is', blockArray);
        // dispatch(blockReducer)
      })
      .catch(err => {
        console.log('Error in getting blockList', err);
      });

    const subscriber = firestore()
      .collection('RecentChats')
      .doc(uidString)
      .collection('RecentUsers')
      .onSnapshot(x => {
        dispatch(recentUserReducer(x.docs));
      });
    return () => subscriber();
  }, []);

  useEffect(() => {
    userOnlineUpdate();
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      console.log('App has come to the foreground!');
      userOnlineUpdate();
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const userOnlineUpdate = () => {
    setAppStateVisible(appState.current);
    console.log('AppState', appState.current);
    firestore().collection('Users').doc(uidString).update({
      online: appState.current,
    });
  };

  useLayoutEffect(() => {
    firestore()
      .collection('RecentChats')
      .doc(uidString)
      .collection('RecentUsers')
      .get()
      .then(res => {
        dispatch(recentUserReducer(res.docs));
      })
      .catch(err => {
        console.log('The error is ', err);
      });
  }, [uidString]);

  const _renderItem = ({item}) => {
    console.log('ITEMs are', item);
    const lastMsgDate=new Date(item.data().lastMessageAt).toJSON()

    return (
      <React.Fragment>
        {item.data().id != uidString && (
          <TouchableOpacity
            style={styles.renderItem}
            onPress={() => {
              _userItemPress(item.data().id, item.data().phone);
            }}>
            <ImageComponent style={styles.imageStyle} />

            <ViewComponent
            style={{flexDirection:'row'}}
              child={
                <React.Fragment>
                  <ViewComponent child={
                      <React.Fragment>
                      <TextComponent
                        style={{color: colors.white}}
                        text={item.data().phone}
                      />
                      <TextComponent
                        style={{color: 'white'}}
                        text={item.data()?.lastMessage}
                      />
                      </React.Fragment>
                  } />
                  
                  <TextComponent style={{color:'white'}} text={`${lastMsgDate}`}/>
                </React.Fragment>
              }
            />
          </TouchableOpacity>
        )}
      </React.Fragment>
    );
  };

  const _contactPress = () => {
    navigation.push('contactList');
  };

  const _userItemPress = (userId, phoneNum) => {
    const roomId = userId < uidString ? userId + uidString : uidString + userId;
    navigation.navigate('chatRoom', {roomId, userId, phoneNum});
  };

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
          <ButtonComponent
            imgSrc={images.chatIcon}
            _onPress={_contactPress}
            style={styles.contactButton}
          />
        </React.Fragment>
      }
    />
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.purple,
    width: '50%',
    height: '5%',
    borderRadius: 10,
    alignSelf: 'center',
  },
  mainView: {
    flex: 1,
  },
  imageStyle: {
    borderRadius: vw(50),
    height: vh(50),
    width: vw(50),
    marginRight: vw(20),
  },
  renderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: vh(10),
    paddingHorizontal: vw(10),
  },
  contactButton: {
    borderRadius: 50,
    width: vw(50),
    height: vw(50),
    position: 'absolute',
    right: vw(10),
    bottom: vh(50),
  },
});

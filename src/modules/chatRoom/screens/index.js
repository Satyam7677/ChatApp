import React, {useLayoutEffect, useRef, useState} from 'react';
import {
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';

import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import SafeAreaComponent from '../../../components/safeAreaComponent';
import HomeHeader from '../../../routes/routeHeaders/homeHeader';
import ChatHeader from '../../../components/chatHeader';
import {debounce} from '../../../utils/commonFunctions';

const {width} = Dimensions.get('screen');

export default function ChatRoom({route, navigation}) {
  const {roomId, userId, phoneNum} = route.params;
  const [text, setText] = useState(null);
  const dispatch = useDispatch();
  const {uidString} = useSelector(store => store.persistedReducer);
  const [messageArray, setMessageArray] = useState([]);
  const [typing, setTyping] = useState(false);
  const [timer, setTimer] = useState(null);
  const ref = useRef();
  useLayoutEffect(() => {
    const subscriber = firestore()
      .collection('ChatRooms')
      .doc(roomId)
      .collection('messages')
      .onSnapshot(documentSnapshot => {
        const dataArray = documentSnapshot.docs.map(element => {
          return element.data();
        });
        dataArray.sort((a, b) => {
          return b.createdAt - a.createdAt;
        });
        setMessageArray(dataArray);
      });

    const typingListener = firestore()
      .collection('ChatRooms')
      .doc(roomId)
      .collection(userId)
      .doc('CurrentState')
      .onSnapshot(snapShot => { 
        console.log('SnapShot', snapShot);
        setTyping(snapShot?.data()?.isTyping);
      });

    // Stop listening for updates when no longer required
    return () => {
      subscriber();
      typingListener();
    };
  }, [roomId]);

  const onSend = (message = []) => {
    console.log('MessageArray is', messageArray);
    if (messageArray.length == 0) {
      console.log('Inside msg Array', messageArray);
      firestore()
        .collection('RecentChats')
        .doc(uidString)
        .collection('RecentUsers')
        .doc(userId)
        .set({
          id: userId,
          phone: phoneNum,
          lastMessage: text,
          lastMessageAt: new Date().getTime(),
        })
        .then(() => {
          console.log('Success on adding recentChat');
        })
        .catch(() => {
          console.log('Failure to add first chat ');
        });
    } else {
      firestore()
        .collection('RecentChats')
        .doc(uidString)
        .collection('RecentUsers')
        .doc(userId)
        .update({
          lastMessage: text,
          lastMessageAt: new Date().getTime(),
        });
    }
    const msg = {
      _id: Math.random(),
      text: text,
      createdAt: new Date().getTime(),
      sent: true,
      // pending:true,
      received: true,
      user: {
        _id: uidString,
        name: 'React Native',
      },
    };
    setMessageArray(previousMessage => GiftedChat.append(previousMessage, msg));

    //If the sender is in the app users blockList then do not send msg

    firestore()
      .collection('ChatRooms')
      .doc(roomId)
      .collection('messages')
      .add(msg)
      .then(() => {
        'Message added';
      })
      .catch(() => {
        console.log('Message addition failed');
      });
    setText('');
  };

  // const onLongPress = item => {
  //   firestore()
  //     .collection('ChatRooms')
  //     .doc(roomId)
  //     .collection(roomId)
  //     .doc(item)
  //     .delete()
  //     .then(() => {
  //       console.log('Message deleted!');
  //     })
  //     .catch(err => {
  //       console.log('Message delete error', err);
  //     });
  // };

  const onBackPress = () => {
    navigation.goBack();
  };

  const _renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: 'grey',
          },
          right: {
            backgroundColor: 'green',
          },
        }}
        tickStyle={{color: 'white'}}
      />
    );
  };

  const funTyping = bool => {
    firestore()
      .collection('ChatRooms')
      .doc(roomId)
      .collection(uidString)
      .doc('CurrentState')
      .set({
        isTyping: bool,
      })
      .then(() => {
        console.log('typingSuccess');
      })
      .catch(err => {
        console.log('Typing Failure', err);
      });
  };

  const inputChanged = e => {
    setText(e);
    funTyping(true);

    clearTimeout(timer);

    const newTimer = setTimeout(() => {
      funTyping(false);
    }, 2000);

    setTimer(newTimer);
  };

  return (
    <SafeAreaComponent
      style={{flex: 1}}
      child={
        <React.Fragment>
          <ChatHeader head={phoneNum} id={userId} backCallback={onBackPress} />
          <GiftedChat
            isTyping={typing}
            renderBubble={_renderBubble}
            messagesContainerStyle={style.messageStyle}
            renderAvatar={null}
            onInputTextChanged={inputChanged}
            user={{
              _id: uidString,
            }}
            messages={messageArray}
            onSend={onSend}
          />
        </React.Fragment>
      }
    />
  );
}

const style = StyleSheet.create({
  textInputView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  textInput: {
    backgroundColor: '#CAC9C9',
    flex: 1,
    height: 40,
    borderRadius: 5,
    marginHorizontal: 10,
    width: 250,
    fontSize: 20,
    paddingHorizontal: 10,
  },
  buttonStyle: {
    backgroundColor: 'green',
    justifyContent: 'center',
    width: 100,
    height: 40,
  },
  mainView: {
    flex: 1,
  },
  messageView: {
    maxWidth: width / 1.1,
    marginVertical: 2,
    justifyContent: 'center',
    borderRadius: 17,
    height: 'auto',
    alignItems: 'center',
    minHeight: 40,
    minWidth: 60,
    marginHorizontal: 2,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  messageStyle: {
    // backgroundColor:colors.grey,
  },
});

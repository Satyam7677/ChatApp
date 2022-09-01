import React, { useEffect, useLayoutEffect, useRef, useState} from 'react';
import { Clipboard, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import SafeAreaComponent from '../../../components/safeAreaComponent';
import ChatHeader from '../../../components/chatHeader';
import {fireStoreFunctions} from '../../../utils/commonFunctions';
import {style} from './styles';
import colors from '../../../utils/locale/colors';
import Tooltip from 'react-native-walkthrough-tooltip';
import TextComponent from '../../../components/textComponent';
import ViewComponent from '../../../components/viewComponent';
import { userDataReducer } from '../../../reducer/rootReducer';

export default function ChatRoom({route, navigation}) {
  const {roomId, userId, phoneNum, name} = route.params;
  const [text, setText] = useState(null);
  const {uidString, userData} = useSelector(store => store.persistedReducer);
  const [messageArray, setMessageArray] = useState([]);
  const [typing, setTyping] = useState(false);
  const [timer, setTimer] = useState(null);
  const [optionsVisible, setOptionsVisible] = useState(false);
  // const {recieverBlockList} = useSelector(store=>store.persistedReducer)
  const dispatch = useDispatch()

  useLayoutEffect(() => {

    // const blockListener=fireStoreFunctions.blockListener(userId, checkBlockSuccessCallback)
    
    const subscriber = fireStoreFunctions.roomListener(
      roomId,
      setMessageArrayCallback,
      userId
    );

    const typingListener = fireStoreFunctions.typingListener(
      roomId,
      userId,
      setTypingCallback,
    );

    return () => {

      subscriber;
      typingListener;

      setMessageArray(null)
    };
  }, []);

  // const checkBlockSuccessCallback=(data)=>{
  //   dispatch(blockReducer(data))

  // }

  useEffect(()=>{
    fireStoreFunctions.chatRecieved(roomId, uidString)
  },[messageArray])

  // const {blockList} =userData

  const setTypingCallback = typing => {
    setTyping(typing);
  };


    // const userIndex= blockList?.findIndex(e=>e==userId)
    // const recieverIndex= recieverBlockList?.findIndex(e=>e==uidString)
  
  

  const setMessageArrayCallback = data => {
    const userFilteredData = data.filter(element => {
      return element?.deletedBy == uidString  || element?.deletedBy == roomId 
        ? false
        : true;
    });
    setMessageArray(userFilteredData);
  };

  

  const onSend = (message = []) => {

    const msg = {
      _id: message[0]._id,
      text: text,
      createdAt: new Date().getTime(),
      reciever: {
        _id: userId,
        name,
      },
      user: {
        _id: uidString,
        name: userData?.name,
      },
      sent:true,
      received:false
    };

    setMessageArray(previousMessage => GiftedChat.append(previousMessage, msg));
    fireStoreFunctions.addMessage(
      'ChatRooms',
      roomId,
      'messages',
      msg._id,
      msg,
    );

    const userContent = {
      id: userId,
      phone: phoneNum,
      name: name,
      lastMessage: text,
      lastMessageAt: new Date().getTime(),
      roomId,
    };

    fireStoreFunctions.updateRecentChats(
      'Inbox',
      uidString,
      'RecentUsers',
      userId,
      userContent,
    );

    const recieverContent = {
      id: uidString,
      phone: userData?.phone,
      name: userData?.name,
      lastMessage: text,
      lastMessageAt: new Date().getTime(),
      roomId,
    };

    fireStoreFunctions.updateRecentChats(
      'Inbox',
      userId,
      'RecentUsers',
      uidString,
      recieverContent,
    );
    setText('');
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  const _renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: colors.white,
          },
          right: {
            backgroundColor: colors.purple,
          },
        }}
        tickStyle={{color: 'white'}}
      />
    );
  };

  const onDeleteForMe = message => {
    fireStoreFunctions.delete(
      roomId,
      message._id,
      message?.deletedBy ? roomId : uidString,
    );
    if (messageArray[0]._id === message._id && messageArray.length > 1) {
      const userContent = {
        id: userId,
        phone: phoneNum,
        name: name,
        lastMessage: messageArray[1].text,
        lastMessageAt: messageArray[1].createdAt,
        roomId,
      };
      fireStoreFunctions.updateRecentChats(
        'Inbox',
        uidString,
        'RecentUsers',
        userId,
        userContent,
      );
    } else if (
      messageArray[0]._id === message._id &&
      messageArray.length == 1
    ) {
      const userContent = {
        id: userId,
        phone: phoneNum,
        name: name,
        lastMessage: '',
        lastMessageAt: '',
        roomId,
      };
      fireStoreFunctions.updateRecentChats(
        'Inbox',
        uidString,
        'RecentUsers',
        userId,
        userContent,
      );
    }
  };

  const onDeleteForEveryone = message => {
    fireStoreFunctions.delete(roomId, message._id, roomId);
    if (messageArray[0]._id === message._id && messageArray.length > 1) {
      const userContent = {
        id: userId,
        phone: phoneNum,
        name: name,
        lastMessage: messageArray[1].text,
        lastMessageAt: messageArray[1].createdAt,
        roomId,
      };

      const recieverContent = {
        id: uidString,
        phone: userData?.phone,
        name: userData?.name,
        lastMessage: messageArray[1].text,
        lastMessageAt: messageArray[1].createdAt,
        roomId,
      };
      fireStoreFunctions.updateRecentChats(
        'Inbox',
        uidString,
        'RecentUsers',
        userId,
        userContent,
      );
      fireStoreFunctions.updateRecentChats(
        'Inbox',
        userId,
        'RecentUsers',
        uidString,
        recieverContent,
      );
    } else if (
      messageArray[0]._id === message._id &&
      messageArray.length == 1
    ) {
      const userContent = {
        id: userId,
        phone: phoneNum,
        name: name,
        lastMessage: '',
        lastMessageAt: '',
        roomId,
      };

      const recieverContent = {
        id: uidString,
        phone: userData?.phone,
        name: userData?.name,
        lastMessage: '',
        lastMessageAt: '',
        roomId,
      };
      fireStoreFunctions.updateRecentChats(
        'Inbox',
        uidString,
        'RecentUsers',
        userContent,
      );
      fireStoreFunctions.updateRecentChats(
        'Inbox',
        userId,
        'RecentUsers',
        recieverContent,
      );
    }
  };

  const messageLongPress = (context, message) => {
    if (message.text !== 'This message was deleted') {
      let options;
      let cancelButtonIndex;
      if (message.user._id === uidString) {
        options = [
          'Copy Text',
          'Delete For Me',
          'Delete For Everyone',
          'Cancel',
        ];
        cancelButtonIndex = options.length - 1;
        context.actionSheet().showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
          },
          buttonIndex => {
            switch (buttonIndex) {
              case 0:
                Clipboard.setText(message.text);
                break;
              case 1:
                onDeleteForMe(message);
                break;
              case 2:
                onDeleteForEveryone(message);
                break;
            }
          },
        );
      } else {
        options = ['Copy Text', 'Delete For Me', 'Cancel'];
        cancelButtonIndex = options.length - 1;
        context.actionSheet().showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
          },
          buttonIndex => {
            switch (buttonIndex) {
              case 0:
                Clipboard.setString(message.text);
                break;
              case 1:
                onDeleteForMe(message);
                break;
            }
          },
        );
      }
    }
  };

  const inputChanged = text => {
    if (text.length > 0) {
      setText(text);
      fireStoreFunctions.typingFunction(
        true,
        'ChatRooms',
        roomId,
        uidString,
        'CurrentStatus',
      );
      clearTimeout(timer);
      const newTimer = setTimeout(() => {
        fireStoreFunctions.typingFunction(
          false,
          'ChatRooms',
          roomId,
          uidString,
          'CurrentStatus',
        );
      }, 1500);
      setTimer(newTimer);
    }
  };

  const toolTipCallback = () => {
    setOptionsVisible(true);
  };

  const closeOptions = () => {
    setOptionsVisible(false);
  };

  const clearChats = () => {
    setOptionsVisible(false);
    fireStoreFunctions.clearChats(roomId, uidString, userId)
    
    // fireStoreFunctions.resetRecentChat()
  };

  const blockUser=()=>{

    setOptionsVisible(false)
  //   if(blockList?.length>0)
  //   {
  //     const nArray= blockList?.map(ele=>ele)
  //     nArray.append(userId)
  //   fireStoreFunctions.blockUser(uidString, nArray,blockSuccessCallback)
  // }
  // else
  //  { const blockArray = [userId]
  //   fireStoreFunctions.blockUser(uidString, blockArray, blockSuccessCallback)
  // }
    
  }

  // const unblockUser = ()=>{
  //   setOptionsVisible(false)
  //   const nArray= blockList?.map(ele=>ele)
  //   nArray?.splice(userIndex,1)
  //   fireStoreFunctions.unblockUser(uidString,nArray, blockSuccessCallback)
  // }

  // const blockSuccessCallback=()=>{
  //   fireStoreFunctions.getUserData(uidString,getDataSuccessCallback, getDataFailureCallback)
  // }
  // const getDataSuccessCallback=(data)=>{
  //   dispatch(userDataReducer(data))
  // }

  // const getDataFailureCallback=(err)=>{
  //   console.log('Getting Data error',err)
  // }

  return (
    <SafeAreaComponent
      style={{flex: 1}}
      child={
        <React.Fragment>
          <ChatHeader
            head={name ? name : phoneNum}
            id={userId}
            uid={uidString}
            backCallback={onBackPress}
            toolTipCallback={toolTipCallback}
          />
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
            onLongPress={messageLongPress}
          />
          <Tooltip
            placement="right"
            tooltipStyle={style.tooltipStyle}
            topAdjustment={10}
            onClose={closeOptions}
            contentStyle={{backgroundColor:'transparent', justifyContent:'space-between'}}
            isVisible={optionsVisible}
            content={
              <ViewComponent style={style.toolTipView} child={
              <React.Fragment>
                <TouchableOpacity onPress={clearChats}>
                  <TextComponent style={{color:'white'}} text={'Clear Chats'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={blockUser}>
                  <TextComponent style={{color:'white'}} text={'block' }/>
                </TouchableOpacity>
              </React.Fragment>
              }
              />
            }
          />
        </React.Fragment>
      }
    />
  );
}

import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Clipboard, TouchableOpacity} from 'react-native';
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
import {blockReducer, senderBlockReducer} from '../../../reducer/rootReducer';
import { collectionName, strings } from '../../../utils/locale/strings';

export default function ChatRoom({route, navigation}) {
  const {roomId, userId, phoneNum, name, img} = route.params;
  const [text, setText] = useState(null);
  const {uidString, userData} = useSelector(store => store.persistedReducer);
  const [messageArray, setMessageArray] = useState([]);
  const [typing, setTyping] = useState(false);
  const [timer, setTimer] = useState(null);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const {recieverBlockList} = useSelector(store => store.persistedReducer);
  const {senderBlockList} = useSelector(store => store.persistedReducer);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const blockListener = fireStoreFunctions.blockListener(
      userId,
      checkBlockSuccessCallback,
    );
    const sameUserBlockLstener = fireStoreFunctions.blockListener(
      uidString,
      checkSameUserBlockSuccessCallback,
    );
    const subscriber = fireStoreFunctions.roomListener(
      roomId,
      setMessageArrayCallback,
      userId,
    );

    const typingListener = fireStoreFunctions.typingListener(
      roomId,
      userId,
      setTypingCallback,
    );

    return () => {
      sameUserBlockLstener;
      blockListener, subscriber;
      typingListener;
      setMessageArray(null);
    };
  }, [uidString]);

  const checkSameUserBlockSuccessCallback = data => {
    dispatch(senderBlockReducer(data));
  };

  const checkBlockSuccessCallback = data => {
    dispatch(blockReducer(data));
  };

  useEffect(() => {
    if ((blockIndex == -1 && senderBlockIndex == -1) == true)
      fireStoreFunctions.chatRecieved(roomId, uidString);
  }, [messageArray]);

  const blockIndex = recieverBlockList?.findIndex(e => e === uidString);
  const senderBlockIndex = senderBlockList?.findIndex(e => e == userId);

  const setTypingCallback = typing => {
    setTyping(typing);
  };

  const setMessageArrayCallback = data => {
    const userFilteredData = data.filter(element => {
      return element?.deletedBy == uidString || element?.deletedBy == roomId
        ? false
        : true;
    });
    setMessageArray(userFilteredData);
  };

  const onSend = (message = []) => {
    if (blockIndex == -1 && senderBlockIndex == -1) {
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
        sent: true,
        received: false,
      };

      setMessageArray(previousMessage =>
        GiftedChat.append(previousMessage, msg),
      );

      fireStoreFunctions.addMessage(
        collectionName.chatRooms,
        roomId,
        collectionName.messages,
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
        collectionName.inbox,
        uidString,
        collectionName.recentUsers,
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
        collectionName.inbox,
        userId,
        collectionName.recentUsers,
        uidString,
        recieverContent,
      );
    } else {
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
        sent: true,
        deletedBy: userId,
      };
      setMessageArray(previousMessage =>
        GiftedChat.append(previousMessage, msg),
      );
      fireStoreFunctions.addMessage(
        collectionName.chatRooms,
        roomId,
        collectionName.messages,
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
        collectionName.inbox,
        uidString,
        collectionName.recentUsers,
        userId,
        userContent,
      );
    }
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
        tickStyle={style.tickStyle}
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
        collectionName.inbox,
        uidString,
        collectionName.recentUsers,
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
        collectionName.inbox,
        uidString,
        collectionName.recentUsers,
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
        collectionName.inbox,
        uidString,
        collectionName.recentUsers,
        userId,
        userContent,
      );
      fireStoreFunctions.updateRecentChats(
        collectionName.inbox,
        userId,
        collectionName.recentUsers,
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
        collectionName.inbox,
        uidString,
        collectionName.recentUsers,
        userContent,
      );
      fireStoreFunctions.updateRecentChats(
        collectionName.inbox,
        userId,
        collectionName.recentUsers,
        recieverContent,
      );
    }
  };

  const messageLongPress = (context, message) => {
    if (message.text !== strings.thisMessageWasDeleted) {
      let options;
      let cancelButtonIndex;
      if (message.user._id === uidString) {
        options = [
          strings.copyText,
          strings.deleteForMe,
          strings.deleteForEveryOne,
          strings.cancel,
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
        options = [strings.copyText, strings.deleteForMe , ];
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
        collectionName.chatRooms,
        roomId,
        uidString,
        collectionName.currentStatus
       ,
        (notBlocked = blockIndex == -1 && senderBlockIndex == -1),
      );
      clearTimeout(timer);
      const newTimer = setTimeout(() => {
        fireStoreFunctions.typingFunction(
          false,
          collectionName.chatRooms,
          roomId,
          uidString,
          collectionName.currentStatus,
          (notBlocked = blockIndex == -1 && senderBlockIndex == -1),
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
    fireStoreFunctions.clearChats(roomId, uidString, userId);
    const userContent = {
      id: userId,
      phone: phoneNum,
      name: name,
      lastMessage: '',
      lastMessageAt: '',
      roomId,
    };
    fireStoreFunctions.updateRecentChats(
      collectionName.inbox,
      uidString,
      collectionName.recentUsers,
      userId,
      userContent,
    );
  };

  const blockUser = () => {
    setOptionsVisible(false);
    fireStoreFunctions.blockUser(uidString, userId, blockSuccessCallback);
  };

  const unblockUser = () => {
    setOptionsVisible(false);
    fireStoreFunctions.unblockUser(uidString, userId);
  };

  const blockSuccessCallback = () => {};

  return (
    <SafeAreaComponent
      style={style.mainView}
      child={
        <React.Fragment>
          <ChatHeader
            head={name ? name : phoneNum}
            id={userId}
            uid={uidString}
            backCallback={onBackPress}
            toolTipCallback={toolTipCallback}
            blockIndex={blockIndex}
            typing={typing}
            img={img}
          />
          <GiftedChat
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
            contentStyle={style.tooltipContentStyle}
            isVisible={optionsVisible}
            content={
              <ViewComponent
                style={style.toolTipView}
                child={
                  <React.Fragment>
                    <TouchableOpacity onPress={clearChats}>
                      <TextComponent
                        style={style.textOptions}
                        text={strings.clearChats}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={
                        senderBlockIndex == -1 ? blockUser : unblockUser
                      }>
                      <TextComponent
                        style={style.textOptions}
                        text={senderBlockIndex == -1 ?  strings.block: strings.unblockUser}
                      />
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

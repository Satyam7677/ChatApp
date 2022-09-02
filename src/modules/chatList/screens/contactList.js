import {StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useLayoutEffect} from 'react';
import {blockReducer, userListReducer} from '../../../reducer/rootReducer';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../../utils/locale/colors';
import ImageComponent from '../../../components/imageComponent';
import TextComponent from '../../../components/textComponent';
import SafeAreaComponent from '../../../components/safeAreaComponent';
import ViewComponent from '../../../components/viewComponent';
import {fireStoreFunctions} from '../../../utils/commonFunctions';
import { styles } from './styles';

export default function ContactList({navigation}) {
  const {userList} = useSelector(store => store.persistedReducer);
  const dispatch = useDispatch();
  const {uidString, blockList} = useSelector(store => store.persistedReducer);

  useEffect(() => {
    const subscriber = fireStoreFunctions.checkAllUsers(checkAllUsersSnapShot);
    return subscriber;
  }, []);

  const checkAllUsersSnapShot = data => {
    dispatch(userListReducer(data));
  };

  useLayoutEffect(() => {
    fireStoreFunctions.getAllUsers(
      getAllUserSuccessCallback,
      getAllUserFailureCallback,
    );
  }, [uidString]);

  const getAllUserSuccessCallback = data => {
    dispatch(userListReducer(data));
  };

  const blockSuccessCallback = blockedUser => {
    console.log('Block success');
    dispatch(blockReducer([...blockList, blockedUser]));
  };

  const blockFailureCallback = () => {};

  const unblockSuccessCallback = ind => {
    console.log('unblockSuccess', ind, blockList);
    const x = blockList.splice(ind, 1);
    console.log('After splice', blockList);
    dispatch(blockReducer(blockList));
  };

  const unblockFailureCallback = () => {};

  const _renderItem = ({item}) => {
    const otherUserId = item.data().id;
    return (
      <React.Fragment>
        {item.data().id != uidString && (
          <TouchableOpacity
            style={styles.renderItem}
            onPress={() => {
              _userItemPress(
                otherUserId,
                item.data().phone,
                item?.data()?.name,
              );
            }}

            // onLongPress={()=>{
            //   console.log('BlockList', blockList)
            //   const ind = blockList.findIndex(element=>element==otherUserId)
            //   if(ind!=-1)
            //   {
            //     firestore().collection('Users').doc(uidString).collection('BlockList').doc(otherUserId).delete().then(
            //       (res)=>{
            //         unblockSuccessCallback(ind)
            //         // console.log('Response after block', res)
            //       }
            //     ).catch(
            //       ()=>{
            //         //unblockFailureCallback()

            //       }
            //     )
            //   }
            //   else
            //   {
            //     firestore().collection('Users').doc(uidString).collection('BlockList').doc(otherUserId).set({
            //       isBlocked:true,
            //       id:otherUserId
            //     }).then(
            //       (res)=>{
            //         blockSuccessCallback(otherUserId)
            //         // console.log('Response after unblock', res)
            //       }
            //     ).catch(()=>{
            //       //  blockFailureCallback()
            //     })
            //   }
            // }}
          >
            <ImageComponent style={styles.imageStyle} />
            <ViewComponent
              child={
                <React.Fragment>
                  <TextComponent
                    style={{color: colors.white}}
                    text={
                      item?.data()?.name
                        ? item?.data().name
                        : item?.data()?.phone
                    }
                  />
                  <TextComponent
                    text={item?.data()?.about}
                    style={{color: colors.white}}
                  />
                </React.Fragment>
              }
            />
          </TouchableOpacity>
        )}
      </React.Fragment>
    );
  };

  const _userItemPress = (userId, phoneNum, name) => {
    const roomId = userId < uidString ? userId + uidString : uidString + userId;
    navigation.replace('chatRoom', {roomId, userId, phoneNum, name});
  };

  return (
    <SafeAreaComponent
      style={styles.mainView}
      child={
        <React.Fragment>
          <ViewComponent
            style={styles.alluserListView}
            child={
              <FlatList
                data={userList}
                renderItem={_renderItem}
                bounces={false}
              />
            }
          />
        </React.Fragment>
      }
    />
  );
}

const getAllUserFailureCallback = err => {
  console.log('Error in getAllUser ', err);
};



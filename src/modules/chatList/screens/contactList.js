import {TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useLayoutEffect} from 'react';
import { userListReducer} from '../../../reducer/rootReducer';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../../utils/locale/colors';

import TextComponent from '../../../components/textComponent';
import SafeAreaComponent from '../../../components/safeAreaComponent';
import ViewComponent from '../../../components/viewComponent';
import {fireStoreFunctions} from '../../../utils/commonFunctions';
import {styles} from './styles';
import { strings } from '../../../utils/locale/strings';
import FastImageComponent from '../../../components/fastImageComponent';

const ContactList=({navigation})=> {
  const {userList} = useSelector(store => store.persistedReducer);
  const dispatch = useDispatch();
  const {uidString} = useSelector(store => store.persistedReducer);

  useEffect(() => {
    const subscriber = fireStoreFunctions.checkAllUsers(checkAllUsersSnapShot);
    return subscriber;
  }, []);

  const checkAllUsersSnapShot = data => {
    dispatch(userListReducer(data));
  };

  // useLayoutEffect(() => {
  //   fireStoreFunctions.getAllUsers(
  //     getAllUserSuccessCallback,
  //     getAllUserFailureCallback,
  //   );
  // }, [uidString]);

  // const getAllUserSuccessCallback = data => {
  //   dispatch(userListReducer(data));
  // };


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
                item?.data()?.img,
              );
            }}>

            <FastImageComponent
            uri={item?.data()?.img}
            styles={styles.imageStyle}
            />
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

  const _userItemPress = (userId, phoneNum, name,img) => {
    const roomId = userId < uidString ? userId + uidString : uidString + userId;
    navigation.replace(strings.chatRoom, {roomId, userId, phoneNum, name, img});
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

export default React.memo(ContactList)
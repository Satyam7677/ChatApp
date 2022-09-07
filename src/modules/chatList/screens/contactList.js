import {TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useLayoutEffect} from 'react';
import { userListReducer} from '../../../reducer/rootReducer';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../../utils/locale/colors';
import ImageComponent from '../../../components/imageComponent';
import TextComponent from '../../../components/textComponent';
import SafeAreaComponent from '../../../components/safeAreaComponent';
import ViewComponent from '../../../components/viewComponent';
import {fireStoreFunctions} from '../../../utils/commonFunctions';
import {styles} from './styles';
import { strings } from '../../../utils/locale/strings';

export default function ContactList({navigation}) {
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

  useLayoutEffect(() => {
    fireStoreFunctions.getAllUsers(
      getAllUserSuccessCallback,
      getAllUserFailureCallback,
    );
  }, [uidString]);

  const getAllUserSuccessCallback = data => {
    dispatch(userListReducer(data));
  };


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
            }}>
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
    navigation.replace(strings.chatRoom, {roomId, userId, phoneNum, name});
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

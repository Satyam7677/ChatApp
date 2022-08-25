import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import ButtonComponent from '../../../components/buttonComponent';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  uid,
  userListReducer,
} from '../../../reducer/rootReducer';
import {useDispatch, useSelector} from 'react-redux';
import {CommonActions, StackActions} from '@react-navigation/native';
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
  const {userList} = useSelector(store => store.persistedReducer);

  const dispatch = useDispatch();
  const {uidString} = useSelector(store => store.persistedReducer);

  useEffect(() => {
    console.log('UserLisrt ',userList );
    const subscriber = firestore()
      .collection('Users').onSnapshot(x => {
        dispatch(userListReducer(x.docs))
      });
    return () => subscriber();
  }, []);

  useLayoutEffect(() => {
    firestore()
      .collection('Users')
      .get()
      .then(res => {
        console.log('REs.docs', res.docs);
        dispatch(userListReducer(res.docs));
      })
      .catch(err => {
        console.log('The error is ', err);
      });
  }, [uidString]);





  const _renderItem = ({item}) => {
    console.log('Items in list', item)
    return (
      <React.Fragment>
        {item.data().id != uidString && (
          <TouchableOpacity
            style={styles.renderItem}
            onPress={() => {
              _userItemPress(item.data().id,item.data().phone );
            }}>
            <ImageComponent style={styles.imageStyle} />

            <TextComponent
              style={{color: colors.white}}
              text={item.data().phone}
            />
          </TouchableOpacity>
        )}
      </React.Fragment>
    );
  };


  const _userItemPress = (x, phoneNum) => {
    const roomId = x < uidString ? x + uidString : uidString + x;
    navigation.replace('chatRoom', {roomId,x, phoneNum});
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

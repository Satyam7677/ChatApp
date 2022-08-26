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
  blockReducer,
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
  const {uidString, blockList} = useSelector(store => store.persistedReducer);


  

  useEffect(() => {
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


  const blockSuccessCallback = (blockedUser)=>{
    console.log('Block success')
      dispatch(blockReducer([...blockList, blockedUser]))
  }


  const blockFailureCallback = ()=>{

  }
  

  const unblockSuccessCallback=(ind)=>{
    console.log('unblockSuccess', ind,blockList)
  const x = blockList.splice(ind,1)
    console.log('After splice', blockList)
    dispatch(blockReducer(blockList))
  }

  const unblockFailureCallback=()=>{
    
  }


  const _renderItem = ({item}) => {
    console.log('Items in list', item)
   const otherUserId = item.data().id
    return (
      <React.Fragment>
        {item.data().id != uidString && (
          <TouchableOpacity
            style={styles.renderItem}
            onPress={() => {
              _userItemPress(otherUserId,item.data().phone );
            }}


            onLongPress={()=>{
              console.log('BlockList', blockList)
              const ind = blockList.findIndex(element=>element==otherUserId)
              if(ind!=-1)
              {
                firestore().collection('Users').doc(uidString).collection('BlockList').doc(otherUserId).delete().then(
                  (res)=>{
                    unblockSuccessCallback(ind)
                    // console.log('Response after block', res)
                  }
                ).catch(
                  ()=>{
                    //unblockFailureCallback()
                    
                  }
                )
              }
              else
              {
                firestore().collection('Users').doc(uidString).collection('BlockList').doc(otherUserId).set({
                  isBlocked:true,
                  id:otherUserId
                }).then(
                  (res)=>{
                    blockSuccessCallback(otherUserId)
                    // console.log('Response after unblock', res)
                  }
                ).catch(()=>{
                  //  blockFailureCallback() 
                })
              }
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


  const _userItemPress = (userId, phoneNum) => {
    const roomId = userId < uidString ? userId + uidString : uidString + userId;
    navigation.replace('chatRoom', {roomId,userId, phoneNum});
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

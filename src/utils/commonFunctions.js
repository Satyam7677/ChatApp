import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Snackbar from 'react-native-snackbar';
import ImagePicker from 'react-native-image-crop-picker';



const otpVerification=async (otp, confirmation,phone, successCallBack,failureCallback)=>{
  try{const res = await confirmation.confirm(otp)
  if(res)
  {
    const uidString = res?.user?._user?.uid
    successCallBack(uidString)

    const data =await firestore().collection('Users').doc(uidString).get()

    if(data.data()!=undefined)
    {firestore().collection('Users').doc(uidString).update(
      {
        id:uidString,
        phone
      }
    )}
    else
    {
      firestore().collection('Users').doc(uidString).set(
        {
          id:uidString,
          phone
        }
      )
    }

  }
  }
  catch(err){
    failureCallback(err)
  }
}

const signInWithPhoneNumber = async (
  phone,
  successCallback,
  failureCallback,
) => {
  try {
    const confirmation = await auth().signInWithPhoneNumber(`+${+91 + phone}`);
    if (confirmation) {
      successCallback(confirmation);
    } else {
      failureCallback('Not recieved confrimation');
    }
  } catch (err) {
    failureCallback(errors(err?.code));
  }
};

const signOut = (successCallback, failureCallback) => {
  auth()
    .signOut()
    .then(() => {
      successCallback();
    })
    .catch(err => {
      failureCallback(err);
    });
};

const errors = err => {
  switch (err) {
    case 'auth/invalid-phone-number':
      return 'Invalid Phone Number';
    case 'auth/network-request-failed':
      return 'Check Your Interner Connectivity';
    case 'auth/invalid-verification-code':
      return 'Invalid code: Please try again';
    case 'auth/cancelled-popup-request':
      return 'Sign In cancelled by user ';
    default:
      return 'Some unknown Error Found';
  }
};

const snackbarFunction = txt => {
  return Snackbar.show({
    text: txt,
    duration: Snackbar.LENGTH_SHORT,
  });
};

const imagePickerFunction = (successCallback, failureCallback) => {
  ImagePicker.openPicker({
    width: 300,
    height: 400,
    cropping: true,
  })
    .then(image => {
      successCallback(image.sourceURL, image.path);
    })
    .catch(err => {
      failureCallback(err);
    });
};

const fireStoreFunctions = {
  setUserName: (uid, name) => {
    firestore().collection('Users').doc(uid).update({
      name,
    });
  },
  setAbout: (uid, about) => {
    firestore().collection('Users').doc(uid).update({
      about,
    });
  },
  updateUserDetail:(uid,phone)=>{
   firestore().collection('Users').doc(uid).update(
    {
                 id:uid,
                  phone,
    }
   )
  },
  addMessage: (roomCollection, roomId, messageCollection, msgId, msg) => {
    firestore()
      .collection(roomCollection)
      .doc(roomId)
      .collection(messageCollection)
      .doc(msgId)
      .set(msg)
      .then(() => {})
      .catch(() => {});
  },
  updateRecentChats: (
    inboxCollection,
    userDocId,
    recentUserCollection,
    recieverUserId,
    content,
  ) => {
    firestore()
      .collection(inboxCollection)
      .doc(userDocId)
      .collection(recentUserCollection)
      .doc(recieverUserId)
      .set(content);
  },

  typingFunction: (bool, collectionRoom, roomId, uid, docName, notBlocked) => {
    if(notBlocked==true)
   { firestore()
      .collection(collectionRoom)
      .doc(roomId)
      .collection(uid)
      .doc(docName)
      .set({
        isTyping: bool,
      });
    }
  },

  getUserData: (uid, successCallback, failureCallback) => {
    firestore()
      .collection('Users')
      .doc(uid)
      .get()
      .then(res => {
        successCallback(res?.data());
      })
      .catch(err => {
        failureCallback(err);
      });
  },

  checkRecentInbox: (uid, recentCollection, callback) => {
    firestore()
      .collection('Inbox')
      .doc(uid)
      .collection(recentCollection)
      .onSnapshot(x => {
        callback(x?.docs);
      });
  },

  updateOnlineState: (uid, currentState) => {
    firestore().collection('Users').doc(uid).update({
      online: currentState,
    });
  },
  getAllUsers: (successCallBack, failureCallback) => {
    firestore()
      .collection('Users')
      .get()
      .then(res => {
        successCallBack(res.docs);
      })
      .catch(err => {
        failureCallback(err);
      });
  },

  checkAllUsers: func => {
    firestore()
      .collection('Users')
      .onSnapshot(x => {
        func(x.docs);
      });
  },

  roomListener: (roomId, setMessageArrayCallback, userId) => {
    firestore()
      .collection('ChatRooms')
      .doc(roomId)
      .collection('messages')
      .onSnapshot(async documentSnapshot => {
        const msgQuerySnapShot = await firestore()
          .collection('ChatRooms')
          .doc(roomId)
          .collection('messages')
          .get();
        const batch = firestore().batch();
        msgQuerySnapShot.forEach(documentSnapshot => {
          if (documentSnapshot.data().reciever._id == userId)
            batch.update(documentSnapshot.ref, {received: true});
        });
        const dataArray = documentSnapshot.docs.map(element => {
          return element.data();
        });
        dataArray.sort((a, b) => {
          return b.createdAt - a.createdAt;
        });
        setMessageArrayCallback(dataArray);
      });
  },

  typingListener: (roomId, userId, callback) => {
      firestore()
      .collection('ChatRooms')
      .doc(roomId)
      .collection(userId)
      .doc('CurrentStatus')
      .onSnapshot(snapShot => {
        callback(snapShot?.data()?.isTyping);
      });
  },
  checkOnline: (id, onlineCallback) => {
    firestore()
      .collection('Users')
      .doc(id)
      .onSnapshot(snapshot => {
        onlineCallback(snapshot.data().online);
      });
  },
  blockUser: (uid,userId, successCallBack) => {
    firestore().collection('Users').doc(uid).collection('BlockList').doc(userId).set(
      {

        blocked:true,
        id:userId
      }
    ).then(()=>{
      successCallBack()
    })
  },

  unblockUser: (uid,userId) => {
    firestore().collection('Users').doc(uid).collection('BlockList').doc(userId).delete()
    },
      

  chatRecieved: async (roomId, uid) => {
    const msgQuerySnapShot = await firestore()
      .collection('ChatRooms')
      .doc(roomId)
      .collection('messages')
      .get();
    const batch = firestore().batch();

    msgQuerySnapShot.forEach(documentSnapshot => {
      if (documentSnapshot?.data().user?._id != uid && documentSnapshot?.data().deletedBy != uid)
        batch.update(documentSnapshot.ref, {received: true});
    });

    return batch.commit();
  },
  delete: (roomId, msgId, userId) => {
    firestore()
      .collection('ChatRooms')
      .doc(roomId)
      .collection('messages')
      .doc(msgId)
      .update({
        deletedBy: userId,
      });
  },

  clearChats: async (roomId, uid, userId) => {
    const msgQuerySnapShot = await firestore()
      .collection('ChatRooms')
      .doc(roomId)
      .collection('messages')
      .get();
    const batch = firestore().batch();
    msgQuerySnapShot.forEach(documentSnapshot => {
      const delBy = documentSnapshot?.data()?.deletedBy;
      if (delBy == userId)
        batch.update(documentSnapshot.ref, {deletedBy: roomId});
      else if (delBy == roomId)
        batch.update(documentSnapshot.ref, {deletedBy: roomId});
      else batch.update(documentSnapshot.ref, {deletedBy: uid});
    });

    return batch.commit();
  },
  resetRecentChat: (uid, recieverId) => {
    firestore()
      .collection('Inbox')
      .doc(uid)
      .collection('RecentUsers')
      .doc(recieverId)
      .update({
        text: '',
        createdAt: '',
      });
  },
  blockListener:(userId, successCallBack)=>{
    firestore().collection('Users').doc(userId).collection('BlockList').onSnapshot(
      documentSnapshot=>{
        const blockArray=documentSnapshot.docs.map(ele=>ele.data().id)
        successCallBack(blockArray)
      }
    )
  }
};

export {
  otpVerification,
  imagePickerFunction,
  signInWithPhoneNumber,
  signOut,
  snackbarFunction,
  errors,
  fireStoreFunctions,
};

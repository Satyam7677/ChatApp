import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const otpVerification= async (otp, phone,confirmation ,successCallback, failureCallback)=>{
    try {
      console.log('OTP coming is', otp)
      console.log('Confirmation is', confirmation)
        const response = await confirmation.confirm(otp);
        console.log('Response is', response)
        if (response) {
          console.log('response is', response?.user?._user?.uid)
          const docId=response?.user?._user?.uid

          firestore().collection('Users').doc(docId).set({
            id:docId,
            phone:phone
          }).then(()=>{
            successCallback(docId)
          }).catch((err)=>
          failureCallback(err))


        } else {
          console.log('Verification failure');
          failureCallback('Response Problem')
        }
      } catch (error) {
        if (error.code == 'auth/invalid-verification-code') {
          console.log('Error is---->',error.code)
        } else {
          console.log('Account linking error', error);
          
        }
        failureCallback(error)
      }
}
const signInWithPhoneNumber= async(phone,successCallback, failureCallback )=>{
try {
    const confirmation = await auth().signInWithPhoneNumber(
      `+${+91 + phone}`,
    );
    if (confirmation) {
      successCallback(confirmation)
    } else {
      console.log('not Recieved confirmation');
      failureCallback()
    }
  } catch (err) {
    console.log('Error is', err);
    failureCallback()
  }}

const signOut=(successCallback, failureCallback)=>{
  auth()
  .signOut()
  .then(() => {
    successCallback()
  })
  .catch(err => {
    failureCallback(err)
  });
}


export {otpVerification, signInWithPhoneNumber,signOut}
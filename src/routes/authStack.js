import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../modules/auth/screens/login";
import Otp from "../modules/auth/screens/otpScreen";
import { screenNames } from '../utils/locale/strings';

const loginOptions = {title:'Login', headerBackVisible:false}
const otpOptions = {title:'OTP Verification'}

const Stack = createNativeStackNavigator()
const AuthStack = ()=>{
    return (
            <Stack.Navigator>
            <Stack.Screen name = {screenNames.login} component={Login} options={loginOptions}/>
            <Stack.Screen name={screenNames.otp}  component={Otp} options={otpOptions}/>
            </Stack.Navigator>
    )
} 
export default AuthStack
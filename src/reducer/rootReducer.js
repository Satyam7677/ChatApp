import {createSlice} from '@reduxjs/toolkit';
// import { combineReducers } from 'redux';

const initialState = {
  uidString: '',
  userList :[],
  userOnApp:[],
  messageArray:[],
  recentUsers:[],
  blockList:[]
};

const slice = createSlice({
  name: 'Slice',
  initialState,
  reducers: {
    uid: (state, action) => {
      console.log("inside uid", action.payload)
      state.uidString=action.payload
    },
    userListReducer:(state, action)=>{
      console.log('userList',state.userList)
      state.userList = action.payload
    },
    recentUserReducer:(state, action)=>{
      state.recentUsers = action.payload
    },
    usersOnApp:(state, action)=>{
      state.userOnApp = [...state.userOnApp, action.payload]
    },
    userMessageArrayReducer:(state, action)=>{
      console.log('User')
      state.messageArray = action.payload
    },
    blockReducer:(state, action)=>{
      state.blockList = action.payload
    }

  },
});

export const {uid, userListReducer,usersOnApp,userMessageArrayReducer,recentUserReducer,blockReducer} = slice.actions;
export default slice.reducer;
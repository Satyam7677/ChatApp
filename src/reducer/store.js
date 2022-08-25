import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import rootReducer from '../reducer/rootReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer, persistStore, FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,} from 'redux-persist';
import thunk from 'redux-thunk';
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: {
    persistedReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false}).concat(logger),
});

export const persistor = persistStore(store);
export default store;

import React from 'react';
import {Provider} from 'react-redux';
// import {PersistGate} from 'redux-persist/integration/react';


import store from './src/reducer/store';
import Route from './src/routes';
import {persistor} from './src/reducer/store';


import rootReducer from './src/reducer/rootReducer';
import { PersistGate } from 'redux-persist/integration/react';
import { LogBox } from 'react-native';

export default function App() {

  LogBox.ignoreAllLogs();
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Route />
      </PersistGate>
    </Provider>
  );
}

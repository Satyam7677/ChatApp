import {ActivityIndicator, Dimensions} from 'react-native';
import React from 'react';
import ViewComponent from './viewComponent';

const {height} = Dimensions.get('screen');
export default function ActivityIndicatorComponent({visible}) {
  return (
    <React.Fragment>
      {visible && (
        <ViewComponent
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: height / 2,
          }}
          child={
            <ActivityIndicator
              color={'green'}
              size={'large'}
              style={{alignSelf: 'center'}}
            />
          }
        />
      )}
    </React.Fragment>
  );
}

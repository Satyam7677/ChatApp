import {ActivityIndicator, Dimensions, StyleSheet} from 'react-native';
import React from 'react';
import ViewComponent from './viewComponent';
import colors from '../utils/locale/colors';


const {height} = Dimensions.get('screen');
export default function ActivityIndicatorComponent({visible}) {
  return (
    <React.Fragment>
      {visible && (
        <ViewComponent
          style={styles.mainView}
          child={
            <ActivityIndicator
              color={colors.purple}
              size={'large'}
              style={styles.activityIndicatorStyle}
            />
          }
        />
      )}
    </React.Fragment>
  );
}

const styles = StyleSheet.create(
  {
    mainView:{
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: height / 2,
    },
    activityIndicatorStyle:{alignSelf: 'center'}
  }
)

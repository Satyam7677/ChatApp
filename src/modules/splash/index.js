import { useNavigation } from "@react-navigation/native";
import React, {useEffect, useRef} from "react";
import { Animated, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import ButtonComponent from "../../components/buttonComponent";
import ImageComponent from "../../components/imageComponent";
import ViewComponent from "../../components/viewComponent";
import images from "../../utils/locale/images";
import { screenNames } from "../../utils/locale/strings";

const Splash=()=>{

    const navigation = useNavigation()
    const {uidString} = useSelector(store=>store.persistedReducer)
    const anim = useRef(new Animated.Value(0)).current
    const rotate = new Animated.Value(0)

  useEffect(() => {

    Animated.timing(
        anim,{
          toValue:1,
          duration:2000,
          useNativeDriver:true
        }
    ).start()

    if (uidString) {
      navigation.reset({
        index: 0,
        routes: [{name: screenNames.home}],
      });
    }

  }, []);
  const getStartedPress=()=>{
      navigation.reset(
        {
            index: 0,
            routes: [{name: screenNames.authStack}],
          }
      )
  }

    return(
        <ViewComponent style={styles.mainView} child={
            <React.Fragment>
              <Animated.View style={{transform:[{scale:anim}, {rotate: anim.interpolate(
                {
                  inputRange:[0,0.5,1],
                  outputRange:['0deg', '180deg', '360deg']
                }
              )}]}}>
                <ImageComponent style={styles.imageStyle} imgSrc={images.splashImage}/>
                </Animated.View>
                <Animated.View style={{opacity:anim}}>
                <ButtonComponent label={'Get Started'}  _onPress={getStartedPress}/>
                </Animated.View>

            
            </React.Fragment>
        }/>
        
    )
}

export default Splash

const styles = StyleSheet.create(
  {
    mainView:{flex:1},
    imageStyle:{height:'100%', width:'100%'}

  }
)
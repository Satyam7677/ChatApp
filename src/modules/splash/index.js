import { useNavigation } from "@react-navigation/native";
import React, {useEffect} from "react";
import { useSelector } from "react-redux";
import ButtonComponent from "../../components/buttonComponent";
import ImageComponent from "../../components/imageComponent";
import ViewComponent from "../../components/viewComponent";
import colors from "../../utils/locale/colors";
import images from "../../utils/locale/images";
import { screenNames } from "../../utils/locale/strings";

const Splash=()=>{

    const navigation = useNavigation()
    const {uidString} = useSelector(store=>store.persistedReducer)

  useEffect(() => {
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
        <ViewComponent style={{flex:1}} child={
            <React.Fragment>
            <ImageComponent style={{height:'100%', width:'100%'}} imgSrc={images.splashImage}/>
            <ButtonComponent label={'Get Started'}  _onPress={getStartedPress}/>
            </React.Fragment>
        }/>
        
    )
}

export default Splash
/**
 * Main screen of the app
 */

// React Imports
import {Text, Image, TouchableOpacity} from "react-native";

// Asset imports
import sheldon from '../assets/imgs/sheldon_xmas.png';
import CameraIcon from '../assets/icons/camera.svg';

// Custom imports
import {Screen} from "../features/ui/screen";
import img_styles from "./stylesheets/img-styles.sass";
import styles from "../config/stylesheets/styles.sass"
import {displayObject} from "../utils";

/**
 *
 * @param props Properties?
 * @returns {JSX.Element}
 */
const MainScreen = (props) => {

    const onPress = () => {
      props.navigation.navigate("Camera")
    }

    const icon = (
        <TouchableOpacity style={styles.btnContainer} onPress={onPress}>
            <CameraIcon width={60} height={60}/>
        </TouchableOpacity>);

    return (
        <Screen title={"Repository"} icon={icon} id="1">
            <Text style={styles.grayText}>Hello!</Text>
            <Image source={sheldon} style={img_styles.sheldon_img}/>
        </Screen>
    );
}

export {MainScreen};

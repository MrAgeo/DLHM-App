/**
 * Main screen of the app
 */

// React Imports
import React from 'react';
import { Text, TouchableOpacity, View } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import { launchImageLibrary } from "react-native-image-picker";

// Asset imports
import { CameraIcon, EafitLogo, PlusIcon, ConfigIcon } from "../features/ui/svg-images";

// Custom imports
import { Screen } from "../features/ui/screen";
import { RepositorySelectionScreen } from './subpages/repository-selection';

import img_styles from "./stylesheets/img-styles.sass";
import screen_styles from "./stylesheets/main-screen.sass";
import styles from "../config/stylesheets/styles.sass";

/**
 * Main screen
 * @param props Properties
 * @returns {JSX.Element}
 */
const MainScreen = ({ navigation }) => {
    const isFocused = useIsFocused();
    const onPressCamera = () => {
        navigation.navigate("Camera");
    }

    const onPressConfig = () => {
        navigation.navigate("Configuration");
    }
    
    const onPressPlus = () => {
        opts = {
            mediaType: "photo",
        };
        launchImageLibrary(opts, pickerCallback);
    }

    const pickerCallback = (photo) => {
        if (photo.assets) {
            navigation.navigate("Image Preview", {photo: photo.assets[0]});
        }
    }

    const cameraIcon = (
        <TouchableOpacity style={styles.btnContainer} onPress={onPressCamera}>
            <CameraIcon width={50} height={50} fill="#000"/>
        </TouchableOpacity>);
    
    const plusIcon = (
        <TouchableOpacity style={styles.btnContainer} onPress={onPressPlus}>
            <PlusIcon width={25} height={25} fill="#000"/>
        </TouchableOpacity>);

    const TitleHeader = (
        <View style={screen_styles.header}>
            <View style={screen_styles.logoContainer}>
                <ConfigIcon width={30} height={30} onPress={onPressConfig} />
                <EafitLogo width={100} height={50} style={img_styles.logo_img}/>
            </View>
            <View style={screen_styles.titleHeaderContainer}>
                <View style={screen_styles.title}>
                    <Text style={styles.blackTextBig}>Repository</Text>
                </View>
                {cameraIcon}
            </View>
        </View>);
    
    if (!isFocused) return <View style={{flex: 1}}></View>;
    return (
        <Screen title={TitleHeader} icon={plusIcon} id={"1"}>
            <RepositorySelectionScreen />
        </Screen>
    );
}

export { MainScreen };

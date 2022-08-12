
// React Imports
import React, { useContext } from 'react';
import { TouchableOpacity, View, Alert } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

// Asset imports
import { CameraIcon, EafitLogo, PlusIcon, ConfigIcon, HoloASIcon,
         HoloFBIcon, HoloFNetIcon, HoloHNetIcon } from "../features/ui/svg-images";
import img_styles from "./stylesheets/img-styles.sass";
import screen_styles from "./stylesheets/main-screen.sass";
import styles from "../config/stylesheets/styles.sass";

import FlaskServerApi from '../api/flask-server-api';
import { RepositoryContext } from './contexts';
import { Text } from '../features/ui/mini-components';
import { windowWidth } from '../config';

const MSCameraIcon = ({ navigation }) => {
    const onPressCamera = () => {
        navigation.navigate("Camera");
    }
    
    const size = Math.max(50, 0.14 * windowWidth);
    return (
    <TouchableOpacity style={styles.btnContainer} onPress={onPressCamera}>
        <CameraIcon width={size} height={size} fill="#000"/>
    </TouchableOpacity>);
}

const plusIconStyle = [styles.btnContainer, {paddingHorizontal:"7%"}];
const MSPlusIcon = ({ navigation }) => {
    const onPressPlus = () => {
        const opts = {
            mediaType: "photo",
        };
        launchImageLibrary(opts, pickerCallback);
    }

    const pickerCallback = (photo) => {
        if (photo.assets) {
            navigation.navigate("Image Preview", {photo: photo.assets[0]});
        }
    }
    
    const size = Math.max(25, 0.07 * windowWidth);
    return (
    <TouchableOpacity style={plusIconStyle} onPress={onPressPlus}>
        <PlusIcon width={size} height={size} fill="#000"/>
    </TouchableOpacity>);
}


const TitleHeader = ({ navigation }) => {
    const onPressConfig = () => {
        navigation.navigate("Configuration");
    }

    const sizeConfig = Math.max(30, 0.08 * windowWidth);
    const sizeEafit = Math.max(100, 0.28 * windowWidth);
    return (
    <View style={screen_styles.header}>
        <View style={screen_styles.logoContainer}>
            <ConfigIcon width={sizeConfig} height={sizeConfig} onPress={onPressConfig} />
            <EafitLogo width={sizeEafit} height={ 0.5 * sizeEafit} style={img_styles.logo_img}/>
        </View>
        <View style={screen_styles.titleHeaderContainer}>
            <View style={screen_styles.title}>
                <Text style={styles.blackTextBig}>Repository</Text>
            </View>
            <MSCameraIcon navigation={navigation} />
        </View>
    </View>
    );
}


const createHoloButton = (HoloIcon, width, height, onPress) => {
    return (
        <TouchableOpacity style={styles.btnContainer} onPress={onPress}>
            <HoloIcon width={width} height={height} fill="#fff"/>
        </TouchableOpacity>
    );
}


const ButtonPanel = ({ navigation }) => {

    const { selectedHolo, setSelectedHolo, selectedRef, setSelectedRef } = useContext(RepositoryContext);

    const onPressHolo = (method) => {
        return ( () => {
            // navigation.navigate("Reconstruction Configuration", { method });
            FlaskServerApi.UploadDLHM(selectedHolo, selectedRef)
            .then(res => {
                if (res !== null){
                    let allOk = true;

                    if (!res.holo[0]) {
                        allOk = false;
                        Alert.alert("Error by Holo Upload", res.holo[1]);
                    }
                    if (selectedRef !== null && !res.ref[0]) {
                        allOk = false;
                        Alert.alert("Error by Ref Upload", res.ref[1]);
                    }

                    const hasRef = selectedRef !== null;

                    // Reset values
                    setSelectedHolo(null);
                    setSelectedRef(null);
                    
                    if (allOk) {
                        navigation.navigate("Reconstruction Configuration", { method, hasRef });
                    }
                }
            });
        });
    }
    
    const msHoloAS = createHoloButton(HoloASIcon,   50, 50, onPressHolo("AS"));
    const msHoloFB = createHoloButton(HoloFBIcon,   45, 45, onPressHolo("FB"));
    const msHoloFN = createHoloButton(HoloFNetIcon, 40, 45, onPressHolo("FNet"));
    const msHoloHN = createHoloButton(HoloHNetIcon, 25, 25, onPressHolo("HNet"));

    return (
            <View style={styles.jc_ac}>
                {( selectedHolo === null ?
                    <MSPlusIcon navigation={navigation} />
                    : <View style={screen_styles.btnPanel}>
                        {msHoloAS}
                        {msHoloFB}
                        {msHoloFN}
                        {/* {msHoloHN} */}
                    </View>
                )}
            </View>
        );
}

export { TitleHeader, ButtonPanel };
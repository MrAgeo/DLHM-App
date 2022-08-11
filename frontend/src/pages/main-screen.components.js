
// React Imports
import React, { useContext } from 'react';
import { Text, TouchableOpacity, View, Alert } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

// Asset imports
import { CameraIcon, EafitLogo, PlusIcon, ConfigIcon, HoloASIcon,
         HoloFBIcon, HoloFNetIcon, HoloHNetIcon } from "../features/ui/svg-images";
import img_styles from "./stylesheets/img-styles.sass";
import screen_styles from "./stylesheets/main-screen.sass";
import styles from "../config/stylesheets/styles.sass";

import FlaskServerApi from '../api/flask-server-api';
import { RepositoryContext } from './contexts';

const MSCameraIcon = ({ navigation }) => {
    const onPressCamera = () => {
        navigation.navigate("Camera");
    }
    
    return (
    <TouchableOpacity style={styles.btnContainer} onPress={onPressCamera}>
        <CameraIcon width={50} height={50} fill="#000"/>
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
    
    return (
    <TouchableOpacity style={plusIconStyle} onPress={onPressPlus}>
        <PlusIcon width={25} height={25} fill="#000"/>
    </TouchableOpacity>);
}


const TitleHeader = ({ navigation }) => {
    const onPressConfig = () => {
        navigation.navigate("Configuration");
    }

    return (
    <View style={screen_styles.header}>
        <View style={screen_styles.logoContainer}>
            <ConfigIcon width={30} height={30} onPress={onPressConfig} />
            <EafitLogo width={100} height={50} style={img_styles.logo_img}/>
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
import React, {useRef, useState} from "react";
import {Button, TouchableOpacity, View, Text, StyleSheet} from "react-native";
import {Screen} from "../features/ui/screen";
import styles from "../config/stylesheets/styles.sass";
import camFt_styles from "./stylesheets/camera-screen.sass";

import HomeIcon from "../assets/icons/home.svg"
import {CameraFeature} from "../features/camera";
import {useIsFocused} from "@react-navigation/native";
import {RNCamera} from "react-native-camera";
import {displayObject} from "../utils";

const whiteBalanceList = Object.values(RNCamera.Constants.WhiteBalance);
const whiteBalanceListNames = Object.keys(RNCamera.Constants.WhiteBalance);

const CameraScreen = (props) => {
    const isFocused = useIsFocused();
    const [zoomVal, setZoomVal] = useState(0);
    const [exposureVal, setExposureVal] = useState(0);
    const [exposureTimeVal, setExposureTimeVal] = useState(1/4000);
    const [autoExposureVal, setAutoExposureVal] = useState(false);
    const [focusVal, setFocusVal] = useState(0);
    const [whiteIdx, setWhiteIdx] = useState(0);
    const camera = useRef(null);

    const icon = (
        <TouchableOpacity style={styles.btnContainer} onPress={() => props.navigation.goBack()}>
            <HomeIcon width={60} height={60}/>
        </TouchableOpacity>);


    const changeZoom = () => {
        setZoomVal((zoomVal + 0.2) % 1.2);
        camera.current.setZoom(zoomVal);
    }
    
    const changeExposure = () => {
        setExposureVal((exposureVal + 0.2) % 1.2);
        camera.current.setExposure(exposureVal);
    }
    const changeAutoExposure = () => {
        setAutoExposureVal(!autoExposureVal);
        camera.current.setAutoExposure(autoExposureVal);
    }
    const changeExposureTime = () => {
        setExposureTimeVal((exposureTimeVal > 0.001? 1/4000 : exposureTimeVal * 1.25));
        camera.current.setExposureTime(exposureTimeVal);
    }

    const changeFocusDepth = () => {
        setFocusVal((focusVal + 0.2) % 1.2);
        camera.current.setFocusDepth(focusVal);
    }

    const changeWhiteBalance = () => {
        const idx = whiteIdx % whiteBalanceList.length;
        camera.current.setWhiteBalance(whiteBalanceList[idx]);
        console.log(whiteBalanceListNames[idx]);
        setWhiteIdx(whiteIdx + 1);
    }

    const takePic = async () => {
        let photo = await camera.current.takePic();
        displayObject(photo.uri, alert);
    }

    const pickImage = async () => {
        // let result = await camera.current.pickImage();
        // displayObject(result, alert);
        alert("TODO!")
    }

    return (
        <Screen title={"Camera"} icon={icon} id="2">
            <View style={camFt_styles.cameraContainer}>
                <CameraFeature ref={camera} isFocused={isFocused}/>
            </View>
                <View style={camFt_styles.buttonContainer}>
                    <Button title={"ExpoA"} onPress={changeAutoExposure}/>
                    <Button title={"ExpoT"} onPress={changeExposureTime}/>
                    <Button title={"ExpoC"} onPress={changeExposure}/>
                    <Button title={"Take a picture"} onPress={() => takePic()}/>
                </View>
                <View style={camFt_styles.buttonContainer}>
                    <Button title={"Zoom"} onPress={changeZoom}/>
                    <Button title={"PickImage"} onPress={() => pickImage()}/>
                    <Button title={"Focus"} onPress={changeFocusDepth}/>
                    <Button title={"WB"} onPress={changeWhiteBalance}/>
                </View>
        </Screen>
    );
}

export {CameraScreen};

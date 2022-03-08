import React, {useRef, useState} from "react";
import {Button, TouchableOpacity, View, Text, StyleSheet} from "react-native";
import {Screen} from "../features/ui/screen";
import styles from "../config/stylesheets/styles.sass";
import camFt_styles from "./stylesheets/camera-screen.sass";

import HomeIcon from "../assets/icons/home.svg"
import {CameraFeature} from "../features/camera";
import {useIsFocused} from "@react-navigation/native";
import {Camera} from "expo-camera";
import {displayObject} from "../utils";

const whiteBalanceList = Object.values(Camera.Constants.WhiteBalance);
const whiteBalanceListNames = Object.keys(Camera.Constants.WhiteBalance);

const CameraScreen = (props) => {
    const isFocused = useIsFocused();
    const [zoomVal, setZoomVal] = useState(0);
    const [focusVal, setFocusVal] = useState(0);
    const [whiteIdx, setWhiteIdx] = useState(0);
    const camera = useRef(null);

    const icon = (
        <TouchableOpacity style={styles.btnContainer} onPress={() => props.navigation.goBack()}>
            <HomeIcon width={60} height={60}/>
        </TouchableOpacity>);


    const changeZoom = () => {
        camera.current.setZoom(zoomVal);
        setZoomVal((zoomVal + 0.2) % 1.2);
    }

    const changeFocusDepth = () => {
        camera.current.setFocusDepth(focusVal);
        setFocusVal((focusVal + 0.2) % 1.2);
    }

    const changeWhiteBalance = () => {
        camera.current.setWhiteBalance(whiteBalanceList[whiteIdx % whiteBalanceList.length]);
        setWhiteIdx(whiteIdx + 1);
    }

    const takePic = async () => {
        let photo = await camera.current.takePic();
        displayObject(photo.uri, alert);
    }

    const pickImage = async () => {
        let result = await camera.current.pickImage();
        displayObject(result, alert);
    }

    return (
        <Screen title={"Camera"} icon={icon} id="2">
            <View style={camFt_styles.cameraContainer}>
                <CameraFeature ref={camera} isFocused={isFocused}/>
            </View>
                <View style={camFt_styles.buttonContainer}>
                    <Button title={"Take a picture"} onPress={() => takePic()}/>
                    <Button title={"Zoom"} onPress={changeZoom}/>
                    <Button title={"Focus"} onPress={changeFocusDepth}/>
                </View>
                <View style={camFt_styles.buttonContainer}>
                    <Button title={"PickImage"} onPress={() => pickImage()}/>
                    <Button title={"WB"} onPress={changeWhiteBalance}/>
                </View>
        </Screen>
    );
}

export {CameraScreen};

import React, { useRef, useState, useEffect } from "react";
import { View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { RNCamera } from "react-native-camera";
import { Svg, Circle } from "react-native-svg";
import { Slider } from "@miblanchard/react-native-slider";

import { ParamButtons } from "./camera-screen.components";
import { TouchableText } from "../features/ui/mini-components/mini-components";
import { CameraFeature } from "../features/camera";
import { Screen } from "../features/ui/screen";
import styles from "../config/stylesheets/styles.sass";
import cam_styles from "./stylesheets/camera-screen.sass";

const blackBg = {backgroundColor: "#000"};

const whiteBalanceList = Object.values(RNCamera.Constants.WhiteBalance);
// const whiteBalanceListNames = Object.keys(RNCamera.Constants.WhiteBalance);

// Java TODOs
// TODO: Add getExposureTimeRange / getExposureCompensationRange
// TODO: Add ISO prop (mISO, setISO, updateISO, getISO)
// TODO: Update ExposureTime when AE change & when is set to false (true->false & init ae prop = false)

// JS TODOs
// TODO: Re-render overlay when style changed
// TODO: Fix Slider Update & Drawing
const CameraScreen = ({ navigation }) => {
    // Navigation "isFocused"
    const isFocused = useIsFocused();

    // Camera Props
    const [whiteIdx, setWhiteIdx] = useState(0);

    // Function related to auto-setting of the props
    const [autoFn, setAutoFn] = useState(null);
    const [isAuto, setIsAuto] = useState(true);


    // Take Picture Button
    const [circleRadius, setCircleRadius] = useState("40%");
    const [circleFill, setCircleFill] = useState("black");

    // Slider Settings
    const [sliderVisible, setSliderVisible] = useState(false);
    const [sliderFn, setSliderFn] = useState(null);
    const [sliderMinimum, setSliderMinimum] = useState(0);
    const [sliderMaximum, setSliderMaximum] = useState(1);
    const [txtStyle, setTxtStyle] = useState([cam_styles.autoButtonText, {color: "#fff"}]);
    const [bgStyle, setBgStyle] = useState ([cam_styles.autoButton, {backgroundColor: "#00c2ff"}]);

    const [items, setItems] = useState(null);

    const camera = useRef(null);

    // const setISO = val => camera.current.setISO(val);
    const setAutoISO = val => camera.current.setAutoISO(val);
    const setZoom = val => camera.current.setZoom(val);
    const setExposureCompensation = val => camera.current.setExposureCompensation(val);
    const setAutoExposure = val => camera.current.setAutoExposure(val);
    const setExposureTime = val => camera.current.setExposureTime(val);
    const setFocusDepth = val => camera.current.setFocusDepth(val);
    const setAutoFocus = val => camera.current.setAutoFocus(val);

    const changeISO = (selected) => {
        alert("Todo ISO!")
        // setSliderVisible(selected);
        // if (!selected) return;

        // setAutoFn(setAutoISO);
        // setSliderMinimum(0);
        // setSliderMaximum(1);
        // setSliderFn(setISO)
    }

    const changeZoom = (selected) => {
        setSliderVisible(selected);
        if (!selected) return;

        setAutoFn(null);
        setSliderMinimum(0);
        setSliderMaximum(1);
        setSliderFn(setZoom); // 0 - 1
    }

    const changeExposureCompensation = (selected) => {
        setSliderVisible(selected);
        if (!selected) return;

        setAutoFn(null);
        setSliderMinimum(0);
        setSliderMaximum(1);
        setSliderFn(setExposureCompensation); // 0 - 1
    }

    const changeExposureTime = (selected) => {
        setSliderVisible(selected);
        if (!selected) return;

        setAutoFn(setAutoExposure);
        setSliderMinimum(1/4000);
        setSliderMaximum(3);
        setSliderFn(setExposureTime);
    }

    const changeFocusDepth = (selected) => {
        setSliderVisible(selected);
        if (!selected) return;

        setAutoFn(setAutoFocus);
        setSliderMinimum(0);
        setSliderMaximum(1);
        setSliderFn(setFocusDepth);
    }


    const changeWhiteBalance = () => {
        // setSliderVisible(selected);
        // if (!selected) return;

        const idx = whiteIdx % whiteBalanceList.length;
        // setAutoFn(auto => setWhiteBalance(auto ? RNCamera.Constants.WhiteBalance.auto
        //     : whiteBalanceList[whiteIdx]));
        camera.current.setWhiteBalance(whiteBalanceList[idx]);
        //console.log(whiteBalanceListNames[idx]);
        setWhiteIdx(whiteIdx + 1);
    }

    const takePic = async () => {
        const photo = await camera.current.takePic();
        navigation.navigate("Image Preview", {photo: photo});

    }

    const toggle = () => {
        setIsAuto(!isAuto);
        const txtColor = isAuto ? "#fff" : "#000";
        const bgColor = isAuto ? "#00c2ff" : "#fff";

        setTxtStyle([cam_styles.autoButtonText, {color: txtColor}]);
        setBgStyle([cam_styles.autoButton, {backgroundColor: bgColor}]);
        autoFn(isAuto);
    }


    useEffect(() => {
        const btnNames = ["ISO", "S", "EV", "WB", "F", "Z"];
        const callbacks = [changeISO, changeExposureTime,
                           changeExposureCompensation, changeWhiteBalance,
                           changeFocusDepth, changeZoom];

        setItems(btnNames.map((txt, index) => {
            return({
                text: txt,
                id: index,
                onPress: callbacks[index]
            });
        }));
    }, []);

    return (
        <Screen titleHeight={5}
                titleContainerStyle={blackBg}
                contentContainerStyle={blackBg}
                id="2">
            <View style={cam_styles.cameraContainer}>
                <CameraFeature style={styles.jfe_afe}
                               ref={camera} isFocused={isFocused}>
                    <View style={cam_styles.sliderContainer}>
                        {(sliderVisible?
                            <View style={cam_styles.autoButtonContainer}>
                                <TouchableText text="A"
                                            style={bgStyle}
                                            textStyle={txtStyle}/>
                            </View>
                            : null )}
                        {(sliderVisible ?
                            <Slider containerStyle={cam_styles.slider}
                                    maximumTrackTintColor={"#fff"}
                                    minimumTrackTintColor={"#"}
                                    trackStyle={{height:1}}
                                    thumbTouchSize={{width:20, height:20}}
                                    minimumValue={sliderMinimum}
                                    maximumValue={sliderMaximum}
                                    onValueChange={val => sliderFn(val[0])}
                                    onSlidingStart={() => {if(isAuto) toggle();}}
                                    />
                            : null
                        )}
                    </View>
                    <View style={cam_styles.paramContainer}>
                        {/* <TouchableText text="ISO" onPress={changeISO} />
                        <TouchableText text="AS" onPress={changeAutoExposure} />
                        <TouchableText text="S" onPress={changeExposureTime} />
                        <TouchableText text="EV" onPress={changeExposureCompensation} />
                        <TouchableText text="WB" onPress={changeWhiteBalance} />
                        <TouchableText text="F" onPress={changeFocusDepth} />
                        <TouchableText text="Z" onPress={changeZoom} /> */}
                        <ParamButtons items={items} />
                    </View>
                </CameraFeature>
            </View>
            <View style={cam_styles.buttonContainer}>
                <View style={[cam_styles.snapButton]}>
                    <Svg width="100%" height="100%"
                        onPress={() => takePic()}
                        onPressIn={() => {setCircleFill("white"); setCircleRadius("38%")}}
                        onPressOut={() => {setCircleFill("black"); setCircleRadius("40%")}}>
                            <Circle
                                cx="50%"
                                cy="50%"
                                r={circleRadius}
                                stroke="white"
                                strokeWidth="1"
                                fill={circleFill}
                            />
                    </Svg>
                </View>
            </View>
        </Screen>
    );
}

export { CameraScreen };

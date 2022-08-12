import React, { useRef, useState, useEffect } from "react";
import { View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { RNCamera } from "react-native-camera";
import { Svg, Circle } from "react-native-svg";

import { ParamButtons, ParamSlider } from "./camera-screen.components";
import { TouchableText } from "../features/ui/mini-components";
import { CameraFeature } from "../features/camera";
import { Screen } from "../features/ui/screen";
import styles from "../config/stylesheets/styles.sass";
import cam_styles from "./stylesheets/camera-screen.sass";

const blackBg = {backgroundColor: "#000"};

const whiteBalanceList = Object.values(RNCamera.Constants.WhiteBalance);
// const whiteBalanceListNames = Object.keys(RNCamera.Constants.WhiteBalance);

// Java TODOs
// TODO: Add getExposureTimeRange / getExposureCompensationRange

// JS TODOs
// TODO: Re-render button overlay when style changed
// TODO: Fix Slider Update & Drawing
// TODO: Add auto btn colors to camera-screen.sass instead of hardcoding
const CameraScreen = ({ navigation }) => {
    // Navigation "isFocused"
    const isFocused = useIsFocused();

    // Camera ref
    const camera = useRef(null);

    // Take Picture Button
    const [circleRadius, setCircleRadius] = useState("40%");
    const [circleFill, setCircleFill] = useState("black");


    // Camera Props
    const [whiteIdx, setWhiteIdx] = useState(0);
    const [zoom, setZoom] = useState(0);
    const [iso, setISO] = useState(100);
    const [focusDepth, setFocusDepth] = useState(0);
    const [autoExposure, setAutoExposure] = useState(true);
    const [exposureTime, setExposureTime] = useState(1/2500);
    const [exposureCompensation, setExposureCompensation] = useState(0);

    /*

    // Function related to auto-setting of the props
    const [autoFn, setAutoFn] = useState(null);
    const [isAuto, setIsAuto] = useState(true);


    // Slider Settings
    const [sliderVisible, setSliderVisible] = useState(false);
    const [sliderFn, setSliderFn] = useState(null);
    const [sliderMinimum, setSliderMinimum] = useState(0);
    const [sliderMaximum, setSliderMaximum] = useState(1);
    const [txtStyle, setTxtStyle] = useState([cam_styles.autoButtonText, {color: "#fff"}]);
    const [bgStyle, setBgStyle] = useState ([cam_styles.autoButton, cam_styles.autoButtonBgOn]);

    const [items, setItems] = useState(null);


    // const setISO = val => camera.current.setISO(val);
    //const setAutoISO = val => camera.current.setAutoISO(val);
    const setZoom = val => camera.current.setZoom(val);
    const setExposureCompensation = val => camera.current.setExposureCompensation(val);
    const setAutoExposure = val => camera.current.setAutoExposure(val);
    const setExposureTime = val => { camera.current.setExposureTime(val); console.log("Hello")}
    const setFocusDepth = val => camera.current.setFocusDepth(val);
    const setAutoFocus = val => camera.current.setAutoFocus(val);

    const showISOSlider = (selected) => {
        alert("Todo ISO!")
        // setSliderVisible(selected);
        // if (!selected) return;

        // setAutoFn(setAutoISO);
        // setSliderMinimum(0);
        // setSliderMaximum(1);
        // setSliderFn(setISO)
    }

    const showZoomSlider = (selected) => {
        setSliderVisible(selected);
        if (!selected) return;

        setAutoFn(null);
        setSliderMinimum(0);
        setSliderMaximum(1);
        setSliderFn(setZoom); // 0 - 1
    }

    const showExposureCompensationSlider = (selected) => {
        setSliderVisible(selected);
        if (!selected) return;

        setAutoFn(null);
        setSliderMinimum(0);
        setSliderMaximum(1);
        setSliderFn(setExposureCompensation); // 0 - 1
    }

    const showExposureTimeSlider = (selected) => {
        setSliderVisible(selected);
        if (!selected) return;

        setAutoFn(setAutoExposure);
        setSliderMinimum(1/4000);
        setSliderMaximum(3);
        setSliderFn(setExposureTime);
    }

    const showFocusDepthSlider = (selected) => {
        setSliderVisible(selected);
        if (!selected) return;

        setAutoFn(setAutoFocus);
        setSliderMinimum(0);
        setSliderMaximum(1);
        setSliderFn(setFocusDepth);
    }

    const showWhiteBalanceSlider = () => {
        // setSliderVisible(selected);
        // if (!selected) return;

        const idx = whiteIdx % whiteBalanceList.length;
        // setAutoFn(auto => setWhiteBalance(auto ? RNCamera.Constants.WhiteBalance.auto
        //     : whiteBalanceList[whiteIdx]));
        camera.current.setWhiteBalance(whiteBalanceList[idx]);
        //console.log(whiteBalanceListNames[idx]);
        setWhiteIdx(whiteIdx + 1);
    }

    useEffect(() => {
        const btnNames = ["ISO", "S", "EV", "WB", "F", "Z"];
        const callbacks = [showISOSlider, showExposureTimeSlider,
                           showExposureCompensationSlider, showWhiteBalanceSlider,
                           showFocusDepthSlider, showZoomSlider];

        setItems(btnNames.map((txt, index) => {
            return({
                text: txt,
                id: index,
                onPress: callbacks[index]
            });
        }));
    }, []);

    const toggle = () => {
        setIsAuto(!isAuto);
        const txtColor = isAuto ? "#fff" : "#000";
        const bgColor = isAuto ? "#00c2ff" : "#fff";

        setTxtStyle([cam_styles.autoButtonText, {color: txtColor}]);
        setBgStyle([cam_styles.autoButton, {backgroundColor: bgColor}]);
        if (autoFn !== null ) autoFn(isAuto);
    }
    */

    const takePic = async () => {
        const photo = await camera.current.takePic();
        navigation.navigate("Image Preview", {photo: photo});

    }

    const onPress = () => takePic();
    const onPressIn = () => {setCircleFill("white"); setCircleRadius("38%")};
    const onPressOut = () => {setCircleFill("black"); setCircleRadius("40%")};

    const changeISO = () => {
        camera.current.setISO(iso);
        setISO(100 + ((iso + 100) % 1000));
    };

    const changeZoom = () => {
        camera.current.setZoom(zoom % 1.2);
        setZoom(zoom + 0.2);
    };

    const changeAutoExposure = () => {
        camera.current.setAutoExposure(autoExposure);
        setAutoExposure(!autoExposure);
    };

    const changeExposureCompensation = () => {
        camera.current.setExposureCompensation(exposureCompensation % 10);
        setExposureCompensation(exposureCompensation + 1);
    };

    const changeExposureTime = () => {
        camera.current.setExposureTime(exposureTime);
        const newET = exposureTime*1.25;
        setExposureTime(newET < 0.25 ? newET : 1/2500);
    };

    const changeFocusDepth = () => {
        camera.current.setFocusDepth(focusDepth % 1.2);
        setFocusDepth(focusDepth + 0.2);
    };

    const changeWhiteBalance = () => {
        const idx = whiteIdx % whiteBalanceList.length;
        camera.current.setWhiteBalance(whiteBalanceList[idx]);
        //console.log(whiteBalanceListNames[idx]);
        setWhiteIdx(whiteIdx + 1);
    };


    return (
        <Screen titleHeightNorm={.05}
                titleContainerStyle={blackBg}
                contentContainerStyle={blackBg}
                id="2">
            <View style={cam_styles.cameraContainer}>
                <CameraFeature style={styles.jfe_afe}
                               ref={camera} isFocused={isFocused}>
                    {/* <ParamSlider visible={sliderVisible} sliderFn={sliderFn}
                        sliderMinimum={sliderMinimum} sliderMaximum={sliderMaximum}
                        txtStyle={txtStyle} bgStyle={bgStyle}
                        isAuto={isAuto} toggle={toggle} /> */}
                    <View style={[cam_styles.paramContainer,{flexDirection:"row"}]}>
                        <TouchableText text="ISO" onPress={changeISO} />
                        <TouchableText text="AS" onPress={changeAutoExposure} />
                        <TouchableText text="S" onPress={changeExposureTime} />
                        <TouchableText text="EV" onPress={changeExposureCompensation} />
                        <TouchableText text="WB" onPress={changeWhiteBalance} />
                        <TouchableText text="F" onPress={changeFocusDepth} />
                        <TouchableText text="Z" onPress={changeZoom} />
                        {/* <ParamButtons items={items} /> */}
                    </View>
                </CameraFeature>
            </View>
            <View style={cam_styles.buttonContainer}>
                <View style={[cam_styles.snapButton]}>
                    <Svg width="100%" height="100%"
                        onPress={onPress}
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}>
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

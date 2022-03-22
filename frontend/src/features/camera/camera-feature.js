import React, {Component, useEffect} from "react";
import {View, Text} from "react-native";
import {RNCamera} from "react-native-camera";
import { displayObject } from "../../utils";

import styles from "./camera.sass";

const InfoView = (props) => (
    <View
        style={{
            flex: 1,
            backgroundColor: props.bgColor || "lightgreen",
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <Text>{props.text}</Text>
    </View>
);

// Max whiteBalance value
const MAX_LENGTH = 5;

class CameraFeature extends Component {
    state = {
        hasPermission: null,
        autoExposure: false,
        exposureTime: 1/4000,
        exposure: 0,
        ratio: "4:3",
        pictureSize: "None",
        zoom: 0,
        whiteBalance: RNCamera.Constants.WhiteBalance.manual,
        whiteIdx: 0,
        focusDepth: 0,
        // ready: false,
    }

    setHasPermission(val) {
        this.setState({hasPermission: val});
    }

    setExposure(val) {
        this.setState({exposure: val});
    }
    
    setAutoExposure(val) {
        this.setState({autoExposure: val});
    }

    setExposureTime(val) {
        this.setState({exposureTime: val});
    }

    setType(val) {
        this.setState({type: val});
    }

    setRatio(val) {
        this.setState({ratio: val});
    }

    setPictureSize(val) {
        this.setState({pictureSize: val});
    }

    setZoom(val) {
        this.setState({zoom: val});
    }

    setWhiteBalance(val) {
        this.setState({whiteBalance: val});
    }

    setWhiteIdx(val) {
        this.setState({whiteIdx: val});
    }

    setFocusDepth(val) {
        this.setState({focusDepth: val});
    }

    setReady(val) {
        // this.setState({ready: val});
        this.ready = val;
    }

    async onCameraReady() {
        if (this.ready) {
            const ratios = await this.cameraRef.getSupportedRatiosAsync().catch(err => console.log(err));
            if (ratios) {
                if (ratios.find(i => i === '1:1')) {
                    this.setRatio('1:1');

                } else {
                    Alert.alert("Could not set 1:1 ratio")
                }
            }
            const pictureSizes = await this.cameraRef.getAvailablePictureSizesAsync(this.state.ratio)
                .catch(err => console.log(err));
            if (pictureSizes) {
                this.setPictureSize(pictureSizes[0])
                this.setReady(true);
            }
        }
    }

    // changeWhiteBalance() {
    //     const idx = this.state.whiteIdx % whiteBalanceList.length;
    //     this.setWhiteBalance(whiteBalanceList[idx]);
    //     console.log(whiteBalanceListNames[idx]);
    //     this.setWhiteIdx(this.state.whiteIdx + 1);
    // }

    async takePic() {
        let photo = await this.cameraRef.takePictureAsync({
            quality: 1, // 0 - 1
            orientation: "auto",
            base64: false,
            mirrorImage: false,
            exif: false,
            writeExif: false
        })
        return photo;
    }

    // async pickImage() {
    //     let result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //     });
    //     return result;
    // }

    // async componentDidMount() {
    //     RNCamera.requestCameraPermissionsAsync().then(res => this.setHasPermission(res === "authorized"));
    // }

    constructor(props) {
        super(props);
        this.cameraRef = null;
        this.ready = false;
    }

    render() {
        // if (this.state.hasPermission == null) return <InfoView text={"Waiting..."}/>
        // if (!this.state.hasPermission) return <InfoView text={"No access to camera"} bgColor={"firebrick"}/>

        if (!this.props.isFocused) return <InfoView text={"Not focused"}/>
        return (
                <RNCamera style={styles.preview}
                        ref={ref => this.cameraRef = ref}

                        exposure={this.state.exposure}
                        exposureTime={this.state.exposureTime}
                        zoom={this.state.zoom}
                        focusDepth={this.state.focusDepth}
                        ratio={this.state.ratio}
                        pictureSize={this.state.pictureSize}
                        whiteBalance={this.state.whiteBalance}
                        
                        
                        autoFocus={RNCamera.Constants.AutoFocus.off}
                        autoExposure={this.state.autoExposure}
                        useCamera2Api={true}
                        type={RNCamera.Constants.Type.back}
                        flashMode={RNCamera.Constants.FlashMode.off}
                        onCameraReady={this.onCameraReady}
                        captureAudio={false}

                        androidCameraPermissionOptions={{
                            title: 'Permission to use camera',
                            message: 'We need your permission to use your camera',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                          }}
                />
        );
    }
}

export {CameraFeature};

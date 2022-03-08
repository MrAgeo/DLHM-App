import React, {Component} from "react";
import {View, Text} from "react-native";
import {Camera} from "expo-camera";
import * as ImagePicker from 'expo-image-picker';

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

const whiteBalanceList = Object.values(Camera.Constants.WhiteBalance);
const whiteBalanceListNames = Object.keys(Camera.Constants.WhiteBalance);

class CameraFeature extends Component {
    state = {
        hasPermission: null,
        ratio: "4:3",
        pictureSize: "None",
        zoom: 0,
        whiteBalance: Camera.Constants.WhiteBalance.manual,
        whiteIdx: 0,
        focusDepth: 0,
        // ready: false,
    }

    setHasPermission(val) {
        this.setState({hasPermission: val});
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

    changeWhiteBalance() {
        const idx = this.state.whiteIdx % whiteBalanceList.length;
        this.setWhiteBalance(whiteBalanceList[idx]);
        console.log(whiteBalanceListNames[idx]);
        this.setWhiteIdx(this.state.whiteIdx + 1);
    }

    async takePic() {
        let photo = await this.cameraRef.takePictureAsync({
            quality: 1,
            base64: false,
            exif: false,
            // onPictureSaved: () => alert("Picture Saved!"),
            skipProcessing: false,
        });
        return photo;
    }

    async pickImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
        return result;
    }

    async componentDidMount() {
        const {status} = await Camera.requestCameraPermissionsAsync();
        this.setHasPermission(status === 'granted');
    }

    constructor(props) {
        super(props);
        this.cameraRef = null;
        this.ready = false;
    }

    render() {

        if (this.state.hasPermission == null) return <InfoView text={"Waiting..."}/>
        if (!this.state.hasPermission) return <InfoView text={"No access to camera"} bgColor={"firebrick"}/>

        if (!this.props.isFocused) return <InfoView text={"Not focused"}/>
        return (
            // <View style={styles.container}>
            //     <View style={{flex: 0.1}}>
            //     <Text>Hello</Text>
            //     </View>
            //     <View style={{flex: 0.9}}>
            //     </View>
            // </View>
                <Camera style={styles.preview}
                        type={Camera.Constants.Type.back}
                        ref={ref => this.cameraRef = ref}
                        onCameraReady={this.onCameraReady}
                        useCamera2Api={true}

                        autoFocus={Camera.Constants.AutoFocus.off}
                        flashMode={"off"}
                        focusDepth={this.state.focusDepth}
                        ratio={this.state.ratio}
                        whiteBalance={this.state.whiteBalance}
                        zoom={this.state.zoom}/>
        );
    }
}

export {CameraFeature};

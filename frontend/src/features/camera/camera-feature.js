import React, {Component, useEffect } from "react";
import { View, Text } from "react-native";
import { RNCamera } from "react-native-camera";

import cam_styles from "./camera.sass";
import styles from "../../config/stylesheets/styles.sass";

class CameraFeature extends Component {
    state = {
        iso: 100,
        autoIso: true,
        autoExposure: true,
        autoFocus: true,
        exposureTime: 1/2500, // 0
        exposureCompensation: 0,
        ratio: "4:3",
        pictureSize: "None",
        zoom: 0, // -1
        whiteBalance: RNCamera.Constants.WhiteBalance.auto,
        whiteIdx: 0,
        focusDepth: 0, // -1
    }


    setDefaultValues() {
        this.setExposureCompensation(100);
        this.setAutoISO(true);
        this.setAutoExposure(true);
        this.setAutoFocus(true);
        this.setExposureTime(1/2500);
        this.setZoom(0);
        this.setWhiteBalance(RNCamera.Constants.WhiteBalance.auto);
        this.setFocusDepth(0);
    }

    setISO(val) {
        this.setState({iso: val})
    }

    setAutoISO(val) {
        this.setState({autoIso: val})
    }

    setExposureCompensation(val) {
        this.setState({exposureCompensation: val});
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

    setAutoFocus(val) {
        this.setState({autoFocus: val});
    }

    async onCameraReady() {
        const ratios = await this.cameraRef.getSupportedRatiosAsync().catch(err => console.log(err));
        if (ratios) {
            if (ratios.find(i => i === '1:1')) {
                this.setRatio('1:1');
            } else {
                Alert.alert("Could not set 1:1 ratio")
            }
        }
        
        const pictureSizes = await this.cameraRef.getAvailablePictureSizes(this.state.ratio)
            .catch(err => console.log(err));
        if (pictureSizes) {
            this.setPictureSize(pictureSizes[0])
        }
    }

    async takePic() {
        let photo = await this.cameraRef.takePictureAsync({
            width: 1024,
            quality: 1, // 0 - 1
            orientation: "auto",
            base64: false,
            mirrorImage: false,
            exif: false,
            writeExif: false
        })
        return photo;
    }

    constructor(props) {
        super(props);

        const baseOverlayStyle = {flex: 1, width: "100%", flexDirection: "column", backgroundColor: "#0000"};
        
        this.cameraRef = null;
        this.overlayStyle = props.style === null ? baseOverlayStyle : [baseOverlayStyle, props.style];
    }

    render() {

        if (!this.props.isFocused) return <View style={{flex: 1, backgroundColor: "#000"}}/>
        return (
                <View style={[cam_styles.container, styles.jc_ac]}>
                    <RNCamera style={cam_styles.preview}
                            ref={ref => this.cameraRef = ref}
    
                            exposure={this.state.exposureCompensation}
                            exposureTime={this.state.exposureTime}
                            zoom={this.state.zoom}
                            focusDepth={this.state.focusDepth}
                            ratio={this.state.ratio}
                            pictureSize={this.state.pictureSize}
                            whiteBalance={this.state.whiteBalance}
                            
                            
                            autoFocus={this.state.autoFocus}
                            autoExposure={this.state.autoExposure}
                            useCamera2Api={true}
                            type={RNCamera.Constants.Type.back}
                            flashMode={RNCamera.Constants.FlashMode.off}
                            onCameraReady={() => {
                                this.onCameraReady();
                                // this.setAutoExposure(false);
                                // this.setDefaultValues();
                            }}
                            captureAudio={false}>
                        {(this.props.children === null ?
                          null
                          : <View style={this.overlayStyle}>
                                {this.props.children}
                            </View>
                        )}
                    </RNCamera>
                </View>
        );
    }
}

export { CameraFeature };

import React, {useState, useEffect, useRef, Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from "expo-image-picker";
import { displayObject } from "../utils";

const whiteBalanceList = Object.values(Camera.Constants.WhiteBalance);
const whiteBalanceListNames = Object.keys(Camera.Constants.WhiteBalance);

export default function CameraTest (useClass= false){
    if (useClass) return CameraTestClass;
    return CameraTestFn;
}

function CameraTestFn() {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [ratio, setRatio] = useState("4:3");
    const [pictureSize, setPictureSize] = useState("None");
    const [zoom, setZoom] = useState(0);
    const [whiteBalance, setWhiteBalance] = useState(Camera.Constants.WhiteBalance.manual);
    const [whiteIdx, setWhiteIdx] = useState(0);
    const [focusDepth, setFocusDepth] = useState(0);
    const [ready, setReady] = useState(false);

    const cameraRef = useRef(null);

    const setCameraType = (type) => {
        console.log(type === Camera.Constants.Type.back ? "back" : "front");
        setType(type);
    }
    const onCameraReady = async () => {
        console.log("Hello");
        if (!ready) {
            console.log("Ratio");
            const ratios = await cameraRef.current.getSupportedRatiosAsync().catch(err => console.log(err));
            if (ratios) {
                if (ratios.find(i => i === '1:1')) {
                    setRatio('1:1');

                } else {
                    Alert.alert("Could not set 1:1 ratio")
                }
                console.log(ratios);
            }
            console.log("Pics");
            const pictureSizes = await cameraRef.current.getAvailablePictureSizesAsync(ratio)
                .catch(err => console.log(err));
            if (pictureSizes) {
                setPictureSize(pictureSizes[0])
                console.log(pictureSizes)
                setReady(true);
            }
        }
        console.log("Bye")
    }
    const changeZoom = () => {
        setZoom((zoom + 0.2) % 1.2);
    }

    const changeFocusDepth = () => {
        setFocusDepth((focusDepth + 0.2) % 1.2);
    }

    const changeWhiteBalance = () => {
        const idx = whiteIdx % whiteBalanceList.length;
        setWhiteBalance(whiteBalanceList[idx]);
        console.log(whiteBalanceListNames[idx]);
        setWhiteIdx(whiteIdx + 1);
    }
    const takePic = async () => {
        let photo = await cameraRef.current.takePictureAsync({
            quality: 1,
            base64: false,
            exif: false,
            // onPictureSaved: () => alert("Picture Saved!"),
            skipProcessing: false,
        });
        displayObject(photo.uri);
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
        displayObject(result);
    }

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) return <View/>;
    if (hasPermission === false) return <Text>No access to camera</Text>;
    return (
        <View style={styles.container}>
                <View style={styles.titleContainer}><Text style={{fontSize:20}}>Function Component</Text></View>
            <Camera style={styles.camera}
                    type={type}
                    ref={cameraRef}
                    onCameraReady={onCameraReady}
                    useCamera2Api={true}

                    autoFocus={Camera.Constants.AutoFocus.off}
                    flashMode={"off"}
                    focusDepth={focusDepth}
                    ratio={ratio}
                    whiteBalance={whiteBalance}
                    zoom={zoom}/>
            <View style={styles.buttonContainer}>
                <Button title={"Flip"}
                        onPress={() => {
                            //setReady(false);
                            setCameraType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            );
                        }}
                />
                <Button title={"Take a picture"} onPress={() => takePic()}/>
                <Button title={"Zoom"} onPress={changeZoom}/>
                <Button title={"Focus"} onPress={changeFocusDepth}/>
                <Button title={"WB"} onPress={changeWhiteBalance}/>
                <Button title={"PickImage"} onPress={() => pickImage()}/>
            </View>
        </View>
    );
}

class CameraTestClass extends Component {
    state = {
        hasPermission: null,
        type: Camera.Constants.Type.back,
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

    setCameraType(type) {
        console.log(type === Camera.Constants.Type.back ? "back" : "front");
        this.setType(type);
    }

    async onCameraReady() {
        console.log("Hello");
        if (this.ready) {
            console.log("Ratio");
            const ratios = await this.cameraRef.getSupportedRatiosAsync().catch(err => console.log(err));
            if (ratios) {
                if (ratios.find(i => i === '1:1')) {
                    this.setRatio('1:1');

                } else {
                    Alert.alert("Could not set 1:1 ratio")
                }
                console.log(ratios);
            }
            console.log("Pics");
            const pictureSizes = await this.cameraRef.getAvailablePictureSizesAsync(this.state.ratio)
                .catch(err => console.log(err));
            if (pictureSizes) {
                this.setPictureSize(pictureSizes[0])
                console.log(pictureSizes)
                this.setReady(true);
            }
        }
        console.log("Bye")
    }

    changeZoom() {
        this.setZoom((this.state.zoom + 0.2) % 1.2);
    }

    changeFocusDepth() {
        this.setFocusDepth((this.state.focusDepth + 0.2) % 1.2);
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
        displayObject(photo.uri);
    }

    async pickImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
        displayObject(result);
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
        if (this.state.hasPermission === null) return <View/>;
        if (this.state.hasPermission === false) return <Text>No access to camera</Text>;
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}><Text style={{fontSize:20}}>Class Component</Text></View>
                <Camera style={styles.camera}
                        type={this.state.type}
                        ref={ref => this.cameraRef = ref}
                        onCameraReady={this.onCameraReady}
                        useCamera2Api={true}

                        autoFocus={Camera.Constants.AutoFocus.off}
                        flashMode={"off"}
                        focusDepth={this.state.focusDepth}
                        ratio={this.state.ratio}
                        whiteBalance={this.state.whiteBalance}
                        zoom={this.state.zoom}/>
                <View style={styles.buttonContainer}>
                    <Button title={"Flip"}
                            onPress={() => {
                                //setReady(false);
                                this.setCameraType(
                                    this.state.type === Camera.Constants.Type.back
                                        ? Camera.Constants.Type.front
                                        : Camera.Constants.Type.back
                                );
                            }}
                    />
                    <Button title={"Take a picture"} onPress={() => this.takePic()}/>
                    <Button title={"Zoom"} onPress={() => this.changeZoom()}/>
                    <Button title={"Focus"} onPress={() => this.changeFocusDepth()}/>
                    <Button title={"WB"} onPress={() => this.changeWhiteBalance()}/>
                    <Button title={"PickImage"} onPress={() => this.pickImage()}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        flex: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    titleContainer: {
        flex: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 20
    },
    camera: {
        flex: 80,
    },
});

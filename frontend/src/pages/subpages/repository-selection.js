import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Dirs, FileSystem } from 'react-native-file-access';
import { RNFileSystem, RNCamera } from "react-native-camera";

import { Screen } from "../../features/ui/screen";
import styles from "../../config/stylesheets/styles.sass";
import { ImageSelector } from "../../features/ui/image-selector/image-selector";
import { displayObject } from "../../utils";
import { appPaths } from "../../features/app";

const titleContainerStyle = styles.jc_afe;
const titleStyle = [styles.blackTextSmall, {marginBottom: 0}];
const titleHeight = 7;

const watermark = [styles.grayTextBig, {textAlign: "center"}];

const getItems = async (path) => {
    const res = await FileSystem.ls(path).catch(err => console.log(err));
    return res.map((subentry, index) => ({uri: `file://${path}/${subentry}`, id: index}));
}

const HoloScreen = () => {
    const [holos, setHolos] = useState(null);

    useEffect(() => {
                    (async() => {
                        setHolos(await getItems(appPaths.holoPath));
                    })();
                }, []);
    return (
        <Screen title={"Holograms"}
                titleStyle={titleStyle}
                titleHeight={titleHeight}
                titleContainerStyle={titleContainerStyle}>
            <View style={[styles.jc_ac, {backgroundColor: "#eee", height: "100%", width: "100%"}]}>
                {(holos === null || holos.length === 0 ?
                    <Text style={watermark}>No Holograms</Text>
                    : <ImageSelector items={holos}/>
                )}
            </View>
        </Screen>);
}

const RefScreen = () => {
    const [refs, setRefs] = useState(null);
    
    
    useEffect(() => {
        (async() => {
            setRefs(await getItems(appPaths.refPath));
        })();
    }, []);

    return (
        <Screen title={"References"}
                titleStyle={titleStyle}
                titleHeight={titleHeight}
                titleContainerStyle={titleContainerStyle}>
            {(refs === null || refs.length === 0 ?
                    <Text style={watermark}>No References</Text>
                    :<ImageSelector items={refs}/>
                )}
        </Screen>);
}
const RepositorySelectionScreen = () => {
    //displayObject(RNCamera.fs);
    return (
    <View style={{flex: 1, flexDirection: "row", alignItems: "flex-start"}}>
        <HoloScreen />
        <RefScreen />
    </View>);
}


export { RepositorySelectionScreen };
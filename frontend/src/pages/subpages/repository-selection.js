import React, { useState, useEffect, useContext } from "react";
import { View, Text } from "react-native";
import { Dirs, FileSystem } from 'react-native-file-access';

import styles from "../../config/stylesheets/styles.sass";

import { appPaths } from "../../features/app";
import { Screen } from "../../features/ui/screen";
import { ImageSelector } from "../../features/ui/image-selector/image-selector";
import { RepositoryContext } from "../contexts";
import { createImg } from "../../utils";
import { useIsFocused } from "@react-navigation/native";

const titleContainerStyle = styles.jc_afe;
const titleStyle = [styles.blackTextSmall, {marginBottom: 0}];
const titleHeight = 7;

const watermark = [styles.grayTextBig, {textAlign: "center"}];


const getItems = async (path) => {
    const res = await FileSystem.ls(path).catch(err => console.log(err));
    return res.map((subentry, index) => {
        const itemPath = `${path}/${subentry}`;
        return Object.assign({path: itemPath, id: index}, createImg(itemPath));
    });
}

const RepoGallery = (props) => {
    const [items, setItems] = useState(null);
    const bgColor = {backgroundColor: props.bgColor || "inherit"};

    const isFocused = useIsFocused();

    useEffect(() => {
        (async() => {
            setItems(await getItems(props.path));
        })();
    }, []);

    if (!isFocused) return <View style={{flex: 1}}></View>;
    return (
        <Screen title={props.title}
                titleStyle={titleStyle}
                titleHeight={titleHeight}
                titleContainerStyle={titleContainerStyle}
                contentContainerStyle={bgColor}>
            {(items === null || items.length === 0 ?
                    <Text style={watermark}>{`No ${props.title}`}</Text>
                    : <ImageSelector items={items} setSelection={props.selectionFn}/>
                )}
        </Screen>);
}

const RepositorySelectionScreen = ( { isFocused } ) => {
    const { setSelectedHolo, setSelectedRef } = useContext(RepositoryContext);
    
    if (!isFocused) return <View style={{flex: 1}}></View>;
    return (
        <View style={{flex: 1, flexDirection: "row", alignItems: "flex-start"}}>
            <RepoGallery title={"Holograms"} bgColor={"#eee"}
                         path={appPaths.holoPath} selectionFn={setSelectedHolo}/>
            <RepoGallery title={"References"}
                         path={appPaths.refPath} selectionFn={setSelectedRef}/>
        </View>);
}

export { RepositorySelectionScreen, RepositoryContext };
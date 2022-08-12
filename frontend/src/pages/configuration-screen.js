import React, { useState } from "react";
import { View, TouchableOpacity,  FlatList, Alert } from "react-native";


import { createItems } from "./configuration-screen.options";
import FlaskServerApi from '../api/flask-server-api';

import styles from "../config/stylesheets/styles.sass";
import cfg_styles from "./stylesheets/configuration-screen.sass";
import { getFlaskURL, setFlaskURL, windowHeight } from "../config/constants";
import { TextInput, Text } from "../features/ui/mini-components";


// TODO: Confirmation Dialog for "Clear Holos" & "Clear Refs"
// TODO: Handle no image (response 404) from "Download Last Reconstruction"
const Item = ({ item }) => {
    const onPress = () => item.onPress(); // in case of async
    return (
        <TouchableOpacity style={cfg_styles.item}
                          onPress={onPress}>
            <Text style={cfg_styles.text}>{item.text}</Text>
        </TouchableOpacity>
    );
}

const ConfigurationScreen = ( { navigation } ) => {
    const items = createItems();
    
        items.push({text: "Flask configuration",
                    onPress: () => navigation.navigate("Flask Configuration")
                });
    
    items.push({text: "Download Last Reconstruction",
                onPress: () => FlaskServerApi.GetReconstruction()
                .then(res => {
                    const p = {uri: `file://${res.path()}`};
                    navigation.navigate("Reconstruction Preview", {photo: p})
                })});
    
    const renderItem = ({ item }) => (<Item item={item}/>);
    
    return (
        <FlatList
            persistentScrollbar={true}
            data={items}
            renderItem={renderItem} />
    );
}

const containerStyle = {height: 0.1 * windowHeight};
const titleContainerStyle = [cfg_styles.titleContainer, {borderBottomWidth: 0}]
const textInputStyle = [cfg_styles.holoTextInput, {marginHorizontal: "5%"}];

// TODO: Check connection btn
const FlaskServerConfiguration = () => {
    const [flaskURL, setURL] = useState(getFlaskURL());

    const onPress = () => {
        FlaskServerApi.Ping(flaskURL)
        .then(res => res.json())
        .then(res => {
            if (res === "Who likes DHLM-App? :D") {
                setFlaskURL(flaskURL);
                Alert.alert("Info", "Flask Server IP changed!");
            } else {
                Alert.alert("Error", `'${flaskURL}' is not a valid server`);
            }
        })
        .catch(err => {
            Alert.alert("Error", `Could not connect to '${flaskURL}'`);
            console.log(err);
        });
    }

    const btnContainer = [{height: 0.15 * windowHeight},styles.jc_ac]
    return (
    <View style={cfg_styles.configScreen}>
            <View style={titleContainerStyle}>
                <Text style={cfg_styles.title}>{" Flask Server IP "}</Text>
            </View>
        <View style={containerStyle}>
            <TextInput style={textInputStyle}
                onChangeText={setURL}
                value={flaskURL}
                placeholder={"Flask Server IP"}
                placeholderTextColor={"#aaa"}
                keyboardType="url" />
        </View>
        <View style={btnContainer}>
            <TouchableOpacity style={styles.btnClear}
                onPress={onPress}>
                    <Text style={styles.blackTextSmall_nm}>Ok</Text>
            </TouchableOpacity>
        </View>
    </View>);
}

export { ConfigurationScreen, FlaskServerConfiguration };

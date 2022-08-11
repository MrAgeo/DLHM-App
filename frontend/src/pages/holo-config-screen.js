/**
 * Reconstruction's parameters configuration screen
 */

// React Imports
import React, { useState } from 'react';
import { Alert, TextInput, View, FlatList, TouchableOpacity, Text } from "react-native";


// Custom imports
import styles from "../config/stylesheets/styles.sass";
import cfg_styles from "./stylesheets/configuration-screen.sass";
import { createImg, isNumeric } from '../utils';
import FlaskServerApi from '../api/flask-server-api';
import { windowHeight } from '../config/constants';
import { RadioButton } from '../features/ui/radio-button/radio-button';


const Item = ({ item }) => {
    return (
        <View style={cfg_styles.holoItem}>
            {/* <View style={cfg_styles.holoTextContainer}> */}
                <Text style={cfg_styles.text}>{item.text}</Text>
            {/* </View> */}
            <TextInput style={cfg_styles.holoTextInput}
                onChangeText={item.setValue}
                value={item.value}
                placeholder={item.description}
                placeholderTextColor={"#aaa"}
                keyboardType={item.keyboardType} />
        </View>
    );
}


/**
 * Holo config screen
 * @param props Properties
 * @returns {JSX.Element}
 */

// TODO: (Optional) Add more functions to "constant"; change name
const holoRefFnOptions = ["mean"];
const HoloConfigScreen = ({ navigation, route }) => {
    
    const [holoType, setHoloType] = useState(null);
    const holoTypeOptions = ["Intensity", "Amplitude", "Phase"]
    const onPress = () => {
        const getReconstruction = () => {
            FlaskServerApi.GetReconstruction()
            .then(res => {
                const p = createImg(res.path());
                navigation.navigate("Reconstruction Preview", {photo: p});
            })
            .catch(err => {
                console.log("download error", err);
                Alert.alert("Error", "Download failed! See console for details.");
            });
        }

        let msg = null;
        let params = {method: method, dx: "3.51",
                      out_holo_type: holoType};
        
        if (method === "FNet") {
            params["Wavelength"] = "473";
        }

        for (let item of itemList){
            if (item.text === "Constant"){
                if ( !(isNumeric(item.value) || holoRefFnOptions.includes(item.value))) {
                    msg = `Value of parameter '${item.text}' must be numeric or 'mean'`;
                    break;
                }
            } else {
                if (isNumeric(item.value)) {
                    if (parseFloat(item.value) <= 0){
                        msg = `Value of parameter '${item.text}' must be positive.`;
                        break;
                    }
                } else {
                    msg = `Value of parameter '${item.text}' must be numeric.`;
                    break;
                }
            }
            params[item.text] = item.value;
        }

        if (holoType === null) {
            Alert.alert("Error", "You must select a hologram type");
        } else if (msg === null) {
            FlaskServerApi.CreateReconstruction(params)
            .then(res => res.json())
            .then(res => {
                if (res[0]){
                    getReconstruction();
                } else {
                    Alert.alert("Error", res[1]);
                }
            }).catch(err => {
                console.log("create reconstruction error", err);
                Alert.alert("Error", "Reconstruction creation failed! See console for details.");
            });
        } else {
            Alert.alert("Error", msg);
        }
    }

    const { method, hasRef } = route.params;

    const title = method === "AS" ? "Angular Spectrum" : (method === "FB" ? "Fresnel-Bluestein" : "FocusNet");
    
    let text = [];
    let desc = [];

    if (method !== "FNet"){
        text.push("Wavelength");
        desc.push("Laser wavelength in nm");
        if (method === "FB"){
            text.push("L");
            desc.push("Source to camera distance in µm");
        }
        // text.push("dx");
        // desc.push("Camera sensor pixel pitch in µm");
        text.push("z");
        desc.push("Source to sample distance in µm");
    }

    if (!hasRef) {
        text.push("Constant");
        desc.push("Number or 'mean'");
    }
    
    const listHeight = 117 * text.length;
    const contentHeight = windowHeight - 156;
    const btnContainerHeight = 120;
    const btnContainer = [{height: btnContainerHeight, borderTopColor: "#ccc", borderTopWidth: 1}, styles.jc_ac];
    const listContainer = {height: listHeight > contentHeight ? contentHeight - btnContainerHeight: listHeight};

    let itemList = [];

    for (let i=0; i<text.length; i++) {
        const [value, setValue] = useState(null);
        itemList.push({text: text[i], description: desc[i],
                        value: value, setValue: setValue,
                        keyboardType: text[i] === "Constant"? "default" : "phone-pad"});
    }

    const renderItem = ({ item }) => (<Item item={item}/>);


    return (
        <View style={cfg_styles.configScreen}>
            <View style={cfg_styles.titleContainer}>
                <Text style={cfg_styles.title}>{` ${title} `}</Text>
            </View>
            <View style={listContainer}>
                <FlatList
                    data={itemList}
                    renderItem={renderItem} />
            </View>
            <Text style={cfg_styles.text}>Hologram Type</Text>
            <RadioButton options={holoTypeOptions} setSelection={setHoloType}/>
            <View style={btnContainer}>
                <TouchableOpacity style={cfg_styles.btnClear}
                    onPress={onPress}>
                        <Text style={styles.blackTextSmall_nm}>Reconstruct hologram</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export { HoloConfigScreen };
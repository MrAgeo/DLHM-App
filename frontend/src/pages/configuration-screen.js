import React from "react";
import { TouchableOpacity, Text,  FlatList } from "react-native";
import { items } from "./configuration-screen.options";

import styles from "../config/stylesheets/styles.sass";
import cfg_styles from "./stylesheets/configuration-screen.sass";

const styleBtnClear = {backgroundColor: "#00c2ff", borderRadius: 5,
                       width:"40%", height: "10%", marginVertical: 20};

// TODO: Confirmation Dialog for "Clear Holos" & "Clear Refs"
const Item = ({ item }) => {
    return (
        <TouchableOpacity style={cfg_styles.item} onPress={() => item.onPress()}>
            <Text style={[styles.blackTextSmall, cfg_styles.text]}>{item.text}</Text>
        </TouchableOpacity>
    );
}
const ConfigurationScreen = () => {

    const renderItem = ({ item }) => (<Item item={item}/>);
    
    return (
        <FlatList
            style={cfg_styles.container}
            data={items}
            renderItem={renderItem} />
    );
}

export { ConfigurationScreen };

import React from 'react';
import { View, Text, TouchableOpacity } from "react-native";

import styles from "./mini-components.sass";

const Separator = (props) => (<View style={styles.separator}/>);

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
const baseBtnStyle = {backgroundColor: "#0000", alignItems: "center", justifyContent: "center"};
const baseTxtStyle = {color: "#fff", fontSize: 27, marginHorizontal: "2%"};

const TouchableText = ({ text, children, onPress, style, textStyle }) => {
    const btnStyle = style === null? baseBtnStyle : [baseBtnStyle, style];
    const txtStyle = textStyle === null? baseTxtStyle : [baseTxtStyle, textStyle];
    return (
    <TouchableOpacity style={btnStyle} onPress={onPress}>
        <Text style={txtStyle}>{text || children}</Text>
    </TouchableOpacity>
    );
}

export { Separator, InfoView, TouchableText };

import React from 'react';
import { View, Text as Txt, TextInput as TxtInput, TouchableOpacity, StyleSheet } from "react-native";
import { maxFontSize } from '../../../config';

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
};


// Text & TextInput style analyzer
const getNewStyle = (style) => {
    const flattenedStyle = StyleSheet.flatten(style);
    let fontSize;

    if (Object.keys(flattenedStyle).length !== 0){ // if style is not undefined
        if (flattenedStyle.fontSize === undefined) {
            fontSize = {fontSize: 0.25 * maxFontSize};
        } else {
            if (typeof flattenedStyle.fontSize === "number") {
                fontSize = {fontSize: Math.min(flattenedStyle.fontSize, maxFontSize)};
            } else if (typeof flattenedStyle.fontSize === "string" &&
                       flattenedStyle.fontSize.endsWith("%")){
                fontSize = {
                            fontSize: 0.01 * maxFontSize *
                                      parseFloat(flattenedStyle.fontSize.substring(0,
                                                    flattenedStyle.fontSize.length - 1))
                           };
            } else {
                fontSize = {}; // replace nothing
            }
        }
    }
    return Object.assign({}, flattenedStyle, fontSize);
}

const Text = ({style, ...otherProps}) => {
    const newStyle = getNewStyle(style);
    return <Txt style={newStyle} {...otherProps} />;
};

const TextInput = ({style, ...otherProps}) => {
    const newStyle = getNewStyle(style);
    return <TxtInput style={newStyle} {...otherProps} />;
};

export { Separator, InfoView, TouchableText, Text, TextInput };

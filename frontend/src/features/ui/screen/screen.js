/**
 * Screen Component
 */
import React from 'react';
import { View, Text } from "react-native";

import styles from "./screen.sass"

/**
 *
 * @param props Properties passed as an object
 * @returns {JSX.Element} The Screen Component
 * @constructor
 */
const Screen = (props) => {

    const titleHeight = props.titleHeight || 20;
    const bottomHeight = props.icon ? (props.bottomHeight || 10) : 0;
    const contentHeight = 100 - titleHeight - bottomHeight;

    // Text style
    const titleStyle = props.titleStyle ? [styles.title, props.titleStyle] : styles.title;

    const screenContainer = props.containerStyle ?
                                [styles.screenContainer, props.containerStyle]
                                : styles.screenContainer;
    
    const screenTitle = props.titleContainerStyle ? 
        	[styles.screenTitle, props.titleContainerStyle] : [styles.screenTitle];
    const screenContent = props.contentContainerStyle ?
            [styles.screenContent, props.contentContainerStyle] : [styles.screenContent];
    const screenBottom = props.bottomContainerStyle ?
            [styles.screenBottom, props.bottomContainerStyle] : [styles.screenBottom];

    screenTitle.push({height: titleHeight.toString() + "%"});
    screenContent.push({height: contentHeight.toString() + "%"});
    screenBottom.push({height: bottomHeight.toString() + "%"});

    return (
        <View style={screenContainer} key={props.id}>
            <View style={screenTitle}>
                {(typeof props.title === 'string' ?
                    <Text style={titleStyle}>{props.title}</Text>
                :
                    props.title
                )}
            </View>
            <View style={screenContent}>
                {props.children}
            </View>
            {(props.icon ?
                <View style={screenBottom}>
                    {props.icon}
                </View>
            : null)}
        </View>
    );
}

export { Screen };

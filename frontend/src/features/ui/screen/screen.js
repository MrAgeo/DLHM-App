/**
 * Screen Component
 */
import React from 'react';
import { View } from "react-native";
import { windowHeight } from '../../../config';
import { Text } from '../mini-components/';

import styles from "./screen.sass"

/**
 *
 * @param props Properties passed as an object
 * @returns {JSX.Element} The Screen Component
 * @constructor
 */
const Screen = (props) => {

    const titleHeight = (props.titleHeightNorm || 0.0333) * windowHeight;
    const bottomHeight = props.icon ? (props.bottomHeightNorm || 0.0167) * windowHeight : 0;
    const contentHeight = 0.167 * windowHeight - titleHeight - bottomHeight;

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

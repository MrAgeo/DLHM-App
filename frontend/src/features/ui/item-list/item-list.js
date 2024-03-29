/**
 * ItemList Component.
 */

 import React from 'react';
 import { FlatList, View } from "react-native";
import { Text } from '../mini-components';

import styles from './item-list.sass'


// Item definition
const Item = ({ title, index }) => (
    <View style={styles.item}>
        <Text style={styles.itemTitle}>{index}. {title}</Text>
    </View>
);

/**
 * Returns the ItemList Component
 * @param props Properties passed as an object
 * @returns {JSX.Element} The ItemList Component
 * @constructor
 */
const ItemList = (props) => {

    // There will be a list of these Components
    const renderItem = ({ item, index }) => <Item title={item} index={index + 1}></Item>
    return (
        <FlatList style={props.style} data={props.items} renderItem={renderItem}
                  keyExtractor={(item, index) => item + index}/>
    )
}

export { ItemList };

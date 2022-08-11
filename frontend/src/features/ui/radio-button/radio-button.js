import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

import styles from "../../../config/stylesheets/styles.sass";
import radio_styles from "./radio-button.sass";

const btnStyles = [radio_styles.leftBtn, radio_styles.centerBtn, radio_styles.rightBtn, radio_styles.aloneBtn];

const Item = ({ item, onPress, bgColor }) => {
    const itemStyle = [btnStyles[item.btnType], bgColor];
    return (
        <TouchableOpacity style={itemStyle} onPress={onPress}>
            <Text style={styles.blackTextSmall_nm}>{item.text}</Text>
        </TouchableOpacity>
    );
}

const RadioButton = ({ height, width, options, initialSelection, setSelection }) => {
    const btnContainerHeight = height || 100;
    const btnContainer = [{height: btnContainerHeight, width: width}, styles.jc_ac];


    const btns = options.length == 1 ?
    {
        text: options[0],
        id: 0,
        type: 3
    }
    : options.map((element, index) => {
            return {
                text: element,
                id: index,
                btnType: index == options.length - 1 ? 2 : (index == 0 ? 0 : 1)
            };
    });

    const [selectedId, setSelectedId] = useState(null);
    useEffect(() => {
        if (initialSelection) {
            setSelectedId(initialSelection);
            setSelection(btns[initialSelection].text);
        }}, []);

    const setSelected = (item) => {
       setSelectedId(item.id);
       setSelection(item.text);
    }

    const renderItem = ({ item }) => {
        const onPress = () => setSelected(item);

        const bgColor = item.id === selectedId ? radio_styles.colorSelected : null;
        return (
            <Item
                item={item}
                onPress={onPress}
                bgColor={bgColor}
            />
        );
    };

    return (
        <View style={btnContainer} >
            <FlatList
                style={radio_styles.radioFlatlist}
                data={btns}
                renderItem={renderItem}
                numColumns={options.length}
                keyExtractor={(item) => item.id}
                extraData={selectedId} // re-render if selectedId changes
            />
        </View>
    );
}

export { RadioButton };
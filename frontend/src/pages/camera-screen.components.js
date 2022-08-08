import React, { useState } from "react";
import { View } from "react-native";
import { TouchableText } from "../features/ui/mini-components/mini-components";
import { FlatList } from "react-native";
import cam_styles from "./stylesheets/camera-screen.sass";
import { Slider } from "@miblanchard/react-native-slider";

const Item = ({ item, onPress, color }) => {
    return (
        <TouchableText style={{borderColor: color, borderBottomWidth: 2}}
                       text={item.text}
                     onPress={onPress}/>
    );
}

const ParamButtons = ({ items, numColumns }) => {
    const [selectedId, setSelectedId] = useState(null);

    
      const renderItem = ({ item }) => {
        const onPress = () => {
          setSelectedId(isSelected ? null: item.id);
          item.onPress(item.id === selectedId);
        };

        const isSelected = item.id === selectedId;
        const color = isSelected ? "#ffff" : "#fff0";
        return (
          <Item
            item={item}
            onPress={onPress}
            color={color}
          />
        );
      };
    
    const keyExtractor = (item) => item.id;

    return (
        <FlatList
            style={cam_styles.flatList}
            contentContainerStyle={cam_styles.flatListContentContainer}
            data={items}
            renderItem={renderItem}
            numColumns={items && items.length}
            keyExtractor={keyExtractor}
            extraData={selectedId}
      />
    );
}


const ParamSlider = ({ visible, sliderFn, sliderMinimum,
                       isAuto, sliderMaximum, txtStyle, bgStyle,
                      toggle }) => {
    
    if (!visible) return <View style={cam_styles.sliderContainer}/>;

    const onSlidingStart = () => {if(isAuto) toggle()};
    const onValueChange = val => {if (!(sliderFn === null)) sliderFn(val[0])};
    
    return (
        <View style={cam_styles.sliderContainer}>
            <View style={cam_styles.autoButtonContainer}>
                <TouchableText text="A"
                            style={bgStyle}
                            textStyle={txtStyle}/>
            </View>
            <Slider containerStyle={cam_styles.slider}
                    maximumTrackTintColor={"#fff"}
                    minimumTrackTintColor={"#fff"}
                    trackStyle={{height:1}}
                    thumbTouchSize={{width:20, height:20}}
                    minimumValue={sliderMinimum}
                    maximumValue={sliderMaximum}
                    onValueChange={onValueChange}
                    onSlidingStart={onSlidingStart}
                    />
        </View>);
}
export { ParamButtons, ParamSlider };
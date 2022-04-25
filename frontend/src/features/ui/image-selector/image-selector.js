import React, { useState, useEffect } from "react";
import { Image, FlatList, TouchableOpacity } from "react-native";
import styles from "./stylesheets/image-selector.sass";

const Item = ({ item, onPress, bgColor, opacity }) => {
  return (
    <TouchableOpacity style={[styles.item, {backgroundColor: bgColor}]} onPress={onPress}>
        <Image source={item} style={[styles.image, {opacity: opacity}]}></Image>
    </TouchableOpacity>
);}

const ImageSelector = ({ items, numColumns }) => {
    const [selectedId, setSelectedId] = useState(null);

    const renderItem = ({ item }) => {
        const bgColor = item.id === selectedId ? "#444" : null;
        const opacity = (selectedId === null || item.id === selectedId) ? 1 : 0.6;
        return (
          <Item
            item={item}
            onPress={() => setSelectedId(item.id)}
            bgColor={bgColor}
            opacity={opacity}
          />
        );
      };
    return (
        <FlatList
            style={styles.flatList}
            data={items}
            renderItem={renderItem}
            numColumns={numColumns || 2}
            keyExtractor={(item) => item.id}
            extraData={selectedId}
      />
    );
}

export { ImageSelector };
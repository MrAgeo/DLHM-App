import React, { useState } from "react";
import { TouchableText } from "../features/ui/mini-components/mini-components";
import { FlatList } from "react-native";
import cam_styles from "./stylesheets/camera-screen.sass";

const Item = ({ item, onPress, width}) => {
    return (
        <TouchableText style={{borderColor: "#fff", borderBottomWidth: width}}
                       text={item.text}
                     onPress={onPress}/>
    );
}

const ParamButtons = ({ items, numColumns }) => {
    const [selectedId, setSelectedId] = useState(null);

    const renderItem = ({ item }) => {
        const isSelected = item.id === selectedId;
        const width = isSelected ? 2 : 0;
        return (
          <Item
            item={item}
            onPress={() => {
                setSelectedId(isSelected ? null: item.id);
                item.onPress(item.id === selectedId);
              }}
            width={width}
          />
        );
      };
    return (
        <FlatList
            style={cam_styles.flatList}
            contentContainerStyle={cam_styles.flatListContentContainer}
            data={items}
            renderItem={renderItem}
            numColumns={items && items.length}
            keyExtractor={(item) => item.id}
            extraData={selectedId}
      />
    );
}

export { ParamButtons };
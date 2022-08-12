import React from "react";
import { TouchableOpacity, View, Image } from "react-native";


import { Screen } from "../../features/ui/screen";
import styles from "../../config/stylesheets/styles.sass";
import img_styles from "../stylesheets/img-styles.sass";
import preview_styles from "./stylesheets/preview-screen.sass";
import { HomeIcon } from "../../features/ui/svg-images";
import { useIsFocused } from "@react-navigation/native";
import { Text } from "../../features/ui/mini-components";
import { windowWidth } from "../../config";


const PreviewScreen = ({ route, navigation, title, id, extraContent, extraOnPress }) => {



    const {photo, file} = route.params;
    const img = file || photo ;
    const imgObj = photo === null ? file : photo;

    const isFocused = useIsFocused();

    // console.log("Img source:", img);
    // (async () => console.log("Img cache info:", await Image.queryCache([img.uri])))()

    const onPress = () => {
        if (extraOnPress)
            extraOnPress();
        navigation.navigate("Repositories");
    };

    const size = 0.167 * windowWidth;
    const icon = (
        <TouchableOpacity style={styles.btnContainer} onPress={onPress}>
            <HomeIcon width={size} height={size}/>
        </TouchableOpacity>);

    if (!isFocused) return <View style={{flex: 1}}></View>;
    return (
        <Screen title={title}
                icon={icon}
                id={id}
                titleHeightNorm={0.1}>
            <View style={preview_styles.imgContainer}>
                {(img === null
                        ?
                            <Text style={styles.grayTextBig}>No Image</Text>
                        :
                            <Image source={imgObj}
                                style={img_styles.preview_img}
                                key = {Date.now()}/>
                )}
            </View>
                {extraContent}
        </Screen>
    );
}

export { PreviewScreen };

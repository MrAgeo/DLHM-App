import React from "react";
import { TouchableOpacity, View, Image, Text } from "react-native";
import { Dirs, FileSystem, Util } from 'react-native-file-access';

import { Screen } from "../features/ui/screen";
import styles from "../config/stylesheets/styles.sass";
import img_styles from "./stylesheets/img-styles.sass";
import preview_styles from "./stylesheets/image-preview-screen.sass";
import { appPaths } from "../features/app";

import { HomeIcon } from "../features/ui/svg-images";

const styleBtnClear = {backgroundColor: "#00c2ff", borderRadius: 5,
                       width:"10%", height: "50%", marginVertical: 20,
                       marginHorizontal: 10};

const ImagePreviewScreen = ({route, navigation}) => {
    const {photo, file} = route.params;
    const img = photo || file ;
    const imgObj = photo == null ? file : photo;
    const pathWithFile = img.uri.substring(7); // without "file://"
    console.log(pathWithFile)
    const ext = Util.extname(pathWithFile);

    const icon = (
        <TouchableOpacity style={styles.btnContainer} onPress={() => navigation.navigate("Repositories")}>
            <HomeIcon width={60} height={60}/>
        </TouchableOpacity>);

    const moveFileTo = async (outputPath, prefix) => {
        const holosNum = (await FileSystem.ls(outputPath).catch(err => console.log(err))).length;
        FileSystem.mv(pathWithFile, `${outputPath}/${prefix}_${holosNum}.${ext}`)
          .then(() => alert("File moved successfully!"))
          .catch(err => { console.log(err); alert("An error occurred.")});
    }
    return (
        <Screen title={"Image Preview"}
                icon={icon}
                id="3"
                titleHeight={10}>
            <View style={preview_styles.imgContainer}>
                {(img === null
                        ?
                            <Text style={styles.grayTextBig}>No Image</Text>
                        :
                            <Image source={imgObj}
                                style={img_styles.preview_img}/>
                )}
            </View>
            <View style={preview_styles.btnContainer}>
                <TouchableOpacity style={[styles.btnContainer, styleBtnClear]}
                  onPress={() => {moveFileTo(appPaths.holoPath, "holo"); navigation.navigate("Repositories")}}>
                    <Text style={[styles.blackTextSmall, styles.noMargin]}>Set as Holo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnContainer, styleBtnClear]}
                  onPress={() =>  {moveFileTo(appPaths.refPath, "ref"); navigation.navigate("Repositories")}}>
                    <Text style={[styles.blackTextSmall, styles.noMargin]}>Set as Ref</Text>
                </TouchableOpacity>
            </View>
        </Screen>
    );
}

export { ImagePreviewScreen };

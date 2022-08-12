import React from "react";
import { TouchableOpacity, View } from "react-native";
import { FileSystem, Util } from 'react-native-file-access';

import styles from "../config/stylesheets/styles.sass";
import preview_styles from "./base-pages/stylesheets/preview-screen.sass";
import { appPaths } from "../features/app";
import { PreviewScreen } from "./base-pages/preview-screen";
import { generateUniqueFileName } from "../utils";
import { Text } from "../features/ui/mini-components";

const RepoPreviewScreen = ({ route, navigation }) => {


    const pathWithFile = route.params.photo.uri.substring(7); // without "file://"
    const ext = Util.extname(pathWithFile);

    const moveFileTo = async (outputPath, prefix) => {
        const fileNum = (await FileSystem.ls(outputPath).catch(err => console.log(err))).length;

        FileSystem.mv(pathWithFile, `${outputPath}/${generateUniqueFileName(`${prefix}_${fileNum}.${ext}`)}`)
          .then(() => navigation.navigate("Repositories"))
          .catch(err => { console.log(err); alert("An error occurred.")});
    }

    const onPressHolo = () => moveFileTo(appPaths.holoPath, "holo");
    const onPressRef  = () => moveFileTo(appPaths.refPath, "ref");
    const extraContent = (
        <View style={preview_styles.btnContainer}>
            <TouchableOpacity style={styles.btnClear}
                onPress={onPressHolo}>
                <Text style={styles.blackTextSmall_nm}>Set as Holo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnClear}
                onPress={onPressRef}>
                <Text style={styles.blackTextSmall_nm}>Set as Ref</Text>
            </TouchableOpacity>
        </View>);
    
    return (
        <PreviewScreen route={route} navigation={navigation}
                       title="Image Preview"
                       id="3"
                       extraContent={extraContent}
                       />
        );
}

export { RepoPreviewScreen };

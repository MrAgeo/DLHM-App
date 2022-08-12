import React, { useState } from "react";
import { View } from "react-native";

import { PreviewScreen } from "./base-pages/preview-screen";
import { FileSystem } from 'react-native-file-access';
import { RadioButton } from "../features/ui/radio-button/radio-button";
import { Text } from "../features/ui/mini-components";

import styles from "../config/stylesheets/styles.sass";
import { windowHeight } from "../config";

const ReconstructionViewScreen = ({ route, navigation }) => {
    const [del, setDelete] = useState(false);

    const deleteRec = () => {
        if (del)
            FileSystem.unlink(route.params.photo.uri.substring(7))
            .catch(err => {
                            console.log(err);
                            Alert.alert("Error", "An error occurred. See console for details");
            });
    };
    
    const radioBtnStyle = [{ flexDirection: "column", height: 0.167 * windowHeight, width: "60%"},styles.jc_ac];
    const radioBtn = (
        <View style={radioBtnStyle}>
            <Text style={styles.blackTextSmall}>Delete File?</Text>
            <RadioButton height={0.1 * windowHeight}
                         width={"100%"}
                         options={["Yes", "No"]}
                         initialSelection={1}
                         setSelection={(val) => setDelete(val === "Yes")} />
        </View>
        );

    return (
        <PreviewScreen route={route} navigation={navigation}
                        title="Obtained reconstruction"
                        id="4"
                        extraOnPress={deleteRec}
                        extraContent={radioBtn} />
    );
}

export { ReconstructionViewScreen };

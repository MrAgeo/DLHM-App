/**
 * Main App.
 */

//  React Imports
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { PermissionsAndroid, View, Text, Button } from "react-native";

// Custom imports
import { NavigationStack } from "../navigation";
import styles from "../../config/stylesheets/styles.sass";

/**
 * Creates the app
 * @returns {JSX.Element} The app itself
 * @constructor
 */
export function App() {
    const [readOk, setReadOk] = useState(false);
    const [writeOk, setWriteOk] = useState(false);

    const requestReadWritePermissions = async () => {
        const granted = PermissionsAndroid.RESULTS.GRANTED;
        
        if (!readOk) {
            const readRes = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {title: "About external storage",
                 message: "In order to read and write the holograms and their references," +
                         " we need to access the external storage of your device.",
                 buttonPositive: "Ok" });
                 setReadOk(readRes === granted);
                 setWriteOk(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE));
        }
        if (!writeOk) {
            const writeRes = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
            setReadOk(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE));
            setWriteOk(writeRes === granted);
        }
    }

    useEffect(() => {
            (async () => { // check Permissions
                setReadOk(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE));
                setWriteOk(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE));
            })();
            if (readOk && writeOk) return;
            requestReadWritePermissions().catch(err => console.log(err))
        }, [readOk, writeOk])

    if (readOk && writeOk) {
        // Create App Layout consisting of 3 pages inside a PagerView
        return (
            <NavigationContainer style={styles.container}>
                <NavigationStack/>
            </NavigationContainer>
        );
    }

    const onPress = () => requestReadWritePermissions().catch(err => console.log(err));

    return (
        <View style={[styles.jc_ac, {flex: 1, flexDirection: 'column'}]}>
            <Text style={styles.grayTextBig}>Waiting for permissions...</Text>
            <Button title="Request Permissions"
                onPress={onPress} />
        </View>);
}

/**
 * Main App.
 */

//  React Imports
import React from 'react';
import {NavigationContainer} from "@react-navigation/native";


// Custom imports
import {paletteNames, usePalette} from "../../utils";
import {NavigationStack} from "../navigation";
import styles from "../../config/stylesheets/styles.sass";

/**
 * Initializes and creates the app
 * @returns {JSX.Element} The app itself
 * @constructor
 */
export function App() {
    usePalette(paletteNames[3])

    // Create App Layout consisting of 3 pages inside a PagerView
    return (
        <NavigationContainer style={styles.container}>
            <NavigationStack/>
        </NavigationContainer>
    );
}

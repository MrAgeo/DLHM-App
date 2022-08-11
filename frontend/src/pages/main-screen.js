/**
 * Main screen of the app
 */

// React Imports
import React, { useState, useMemo, useEffect } from 'react';
import { View } from "react-native";
import { useIsFocused } from '@react-navigation/native';


// Custom imports
import { Screen } from "../features/ui/screen";
import { RepositorySelectionScreen } from './subpages';
import { RepositoryContext } from './contexts';
import { TitleHeader, ButtonPanel } from './main-screen.components';


/**
 * Main screen
 * @param props Properties
 * @returns {JSX.Element}
 */

// TODO: Find a way to read TIFF images (Image only supports PNG, JPEG, BMP, WEBP & GIF)
// TODO: Handle different width/height between ref & holo
const MainScreen = ({ navigation }) => {
    const isFocused = useIsFocused();

    const [selectedHolo, setSelectedHolo] = useState(null);
    const [selectedRef, setSelectedRef] = useState(null);

    const repoData = useMemo(() => (
                                {selectedHolo: selectedHolo,
                                 setSelectedHolo: setSelectedHolo,
                                 selectedRef: selectedRef,
                                 setSelectedRef: setSelectedRef
                                }),
                             [selectedHolo, selectedRef]);
    
    useEffect(() => {
        setSelectedHolo(null);
        setSelectedRef(null);
    }, [isFocused]);
    
    const btnPanel = <ButtonPanel navigation={navigation} />;
    const titleHeader = <TitleHeader navigation={navigation}/>;
    
    if (!isFocused) return <View style={{flex: 1}}></View>;

    return (
        <RepositoryContext.Provider value={repoData}>
            <Screen title={titleHeader} icon={btnPanel}
                    bottomContainerStyle={{backgroundColor: selectedHolo === null ? "#ddd" : "#555"}}
                    id="1">
                <RepositorySelectionScreen isFocused={isFocused}/>
            </Screen>
        </RepositoryContext.Provider>
    );
}

export { MainScreen };

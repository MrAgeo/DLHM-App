/**
 * Main screen of the app
 */

// React Imports
import React, { useState, useMemo } from 'react';
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

// TODO: Bugfix when holo or ref selected, then press "clear holos / refs" in config screen
// (is there any onLoad()? -> set null on load)
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

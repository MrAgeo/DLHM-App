import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainScreen, CameraScreen, RepoPreviewScreen, ConfigurationScreen,
         HoloConfigScreen, ReconstructionViewScreen, FlaskServerConfiguration } from '../../pages';
const Stack = createNativeStackNavigator();

const NavigationStack = () => {
    return (
        <Stack.Navigator initialRouteName="Repositories" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Repositories" component={MainScreen} />
            <Stack.Screen name="Camera" component={CameraScreen} />
            <Stack.Screen name="Image Preview" component={RepoPreviewScreen} />
            <Stack.Screen name="Reconstruction Preview" component={ReconstructionViewScreen} />
            <Stack.Screen name="Configuration" component={ConfigurationScreen} options={{headerShown: true}} />
            <Stack.Screen name="Reconstruction Configuration" component={HoloConfigScreen} options={{headerShown: true}} />
            <Stack.Screen name="Flask Configuration" component={FlaskServerConfiguration} options={{headerShown: true}} />
        </Stack.Navigator>)
}

export { NavigationStack };

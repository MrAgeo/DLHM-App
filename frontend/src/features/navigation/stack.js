import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainScreen, CameraScreen, ImagePreviewScreen, ConfigurationScreen } from '../../pages';
import sheldon from "../../assets/imgs/sheldon_xmas.png";

const Stack = createNativeStackNavigator();

const NavigationStack = () => {
    return (
        <Stack.Navigator initialRouteName="Repositories" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Repositories" component={MainScreen} />
            <Stack.Screen name="Camera" component={CameraScreen} />
            <Stack.Screen name="Image Preview" component={ImagePreviewScreen} />
            <Stack.Screen name="Configuration" component={ConfigurationScreen} options={{headerShown: true}} />
        </Stack.Navigator>)
}

export { NavigationStack };

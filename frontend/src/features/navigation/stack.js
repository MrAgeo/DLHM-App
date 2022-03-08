import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {MainScreen, CameraScreen} from '../../pages';

const Stack = createNativeStackNavigator();

const NavigationStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Repositories" component={MainScreen} />
            <Stack.Screen name="Camera" component={CameraScreen} />
        </Stack.Navigator>)
}

export {NavigationStack};

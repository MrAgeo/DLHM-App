import { AppRegistry } from 'react-native';
import { App, initializeApp } from './src/features/app';
import { name as appName } from './app.json';

initializeApp();
AppRegistry.registerComponent(appName, () => App);

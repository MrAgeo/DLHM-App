import { Alert } from 'react-native';
import { Dirs, FileSystem } from 'react-native-file-access';

import { appPaths, basePath, folderNames } from '../features/app';


const showDialog = (path, str) => {
    const sure = Object.values(appPaths).find(d => d === path) ?
                    Alert.alert("Are you sure?", "Are you your you want to delete the contents " + 
                                `of the ${str}?`,
                                [{ text: "Yes", onPress: () => {return "yeah"}},
                                { text: "No", onPress: () =>{return "nope"}}

                                ], {cancelable: false})
                : true;
    alert(sure);
    return sure;
}
/**
 * Removes content of a path
 * @param {String} path path
 * @param {String} str Description
 */
const clearPath = async (path, str) => {
    let ok = true;
    const res = await FileSystem.ls(path).catch(err => { console.log(err); ok = false });
    for (let subentry of res){
        if (folderNames.find(d => d === subentry)) continue;
        await FileSystem.unlink(`${path}/${subentry}`)
            .catch(err => { console.log(err); ok = false});
    }
    Alert.alert(ok ? "Message" : "Error", ok ? str + " cleared successfully!": "An error occurred.");
}

//TODO: Confirmation Dialog
const text = ["Clear cache","Clear holograms", "Clear references", "Say hello"];
const callbacks = [() => clearPath(Dirs.CacheDir, "Cache"),
                   () => clearPath(appPaths.holoPath, "Holograms folder"),
                   () => clearPath(appPaths.refPath, "References folder"), 
                   () => Alert.alert("Message", "Hello!")];

const createItems = () => {
    let list = [];

    for (let i=0; i<text.length;i++) {
        list.push({text: text[i], onPress: callbacks[i]});
    }
    return list;
}
export const items = createItems();
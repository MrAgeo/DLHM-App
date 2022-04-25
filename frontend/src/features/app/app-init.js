import { Dirs, FileSystem, Util } from 'react-native-file-access';

const basePath = Dirs.CacheDir;
const appPaths = {holoPath: `${basePath}/Holos`,
                  refPath: `${basePath}/Refs`};
const folderNames = Object.keys(appPaths).map(k => Util.basename(appPaths[k]));

/**
 * Initialize the application
 */
const initializeApp = async () => {
    // If there is no "Holos" and "Refs" folder, create them
    for (let path in appPaths) {
        if (!(await FileSystem.isDir(appPaths[path]))) FileSystem.mkdir(appPaths[path]).catch(err => console.log(err));
    }
}

export { basePath, appPaths, folderNames, initializeApp };
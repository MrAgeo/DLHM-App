import { FileSystem, Util } from 'react-native-file-access';
import ReactNativeBlobUtil from 'react-native-blob-util';

import { getFlaskURL, setFlaskURL } from '../../config/';

const dirs = ReactNativeBlobUtil.fs.dirs
/*
--------- RNBlob Dirs ---------

  dirs.DocumentDir:         /data/user/0/<APP_ID>/files
  dirs.CacheDir:            /data/user/0/<APP_ID>/cache
  dirs.DCIMDir:             /storage/emulated/0/Android/data/<APP_ID>/DCIM
  dirs.DownloadDir:         /storage/emulated/0/Android/data/<APP_ID>/Download

------- End RNBlob Dirs -------


------ RNFileAccess Dirs ------

  Dirs.DocumentDir:         /data/user/0/<APP_ID>/files
  Dirs.CacheDir:            /data/user/0/<APP_ID>/cache
  Dirs.DatabaseDir:         /data/user/0/<APP_ID>/database
  Dirs.MainBundleDir:       /data/user/0/<APP_ID>
  Dirs.SDCardDir:           /sdcard

---- End RNFileAccess Dirs ----

*/

const baseImagePath = dirs.DCIMDir;
const baseDocsPath = `${Util.dirname(baseImagePath)}/Documents`;
const flaskUrlFilename = "flask.txt";
const flaskUrlFilepath = `${baseDocsPath}/${flaskUrlFilename}`;


const appPaths = {holoPath: `${baseImagePath}/Holos`,
                  refPath: `${baseImagePath}/Refs`,
                  recPath: `${baseImagePath}/Rec`,};
const appFileNames = {holoFileName: "holo.png",
                      refFileName: "ref.png",
                      recFileName: "rec.png"};

const folderNames = Object.keys(appPaths).map(k => Util.basename(appPaths[k]));

/**
 * Initialize the application
 */
const initializeApp = async () => {

    // If there is no "Holos", "Refs" and "Rec" folder, create them
    for (let path in appPaths) {
        if (!(await FileSystem.isDir(appPaths[path]))) FileSystem.mkdir(appPaths[path]).catch(err => console.log(err));
    }

    // Also check Documents dir
    if (!(await FileSystem.isDir(baseDocsPath))) FileSystem.mkdir(baseDocsPath).catch(err => console.log(err));

    // Save/read Flaskurl to/from disk
    if (await FileSystem.exists(flaskUrlFilepath)){
      readFlaskURL();
    } else {
      saveFlaskURL();
    }
}

const saveFlaskURL = () => {
    FileSystem.writeFile(flaskUrlFilepath, getFlaskURL(), 'utf8').catch(err => console.log(err));
}

const readFlaskURL = () => {
    FileSystem.readFile(flaskUrlFilepath, 'utf8').then(data => setFlaskURL(data)).catch(err => console.log(err));
}

export { baseImagePath, baseDocsPath, appPaths, appFileNames, folderNames, initializeApp, saveFlaskURL, readFlaskURL };
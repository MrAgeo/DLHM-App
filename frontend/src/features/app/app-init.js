import { FileSystem, Util } from 'react-native-file-access';
import ReactNativeBlobUtil from 'react-native-blob-util';

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

const basePath = dirs.DCIMDir;
const appPaths = {holoPath: `${basePath}/Holos`,
                  refPath: `${basePath}/Refs`,
                  recPath: `${basePath}/Rec`,};
const appFileNames = {holoFileName: "holo.png",
                      refFileName: "ref.png",
                      recFileName: "rec.png"};

const folderNames = Object.keys(appPaths).map(k => Util.basename(appPaths[k]));

/**
 * Initialize the application
 */
const initializeApp = async () => {
    // If there is no "Holos", "Refs" ansd "Rec" folder, create them
    for (let path in appPaths) {
        if (!(await FileSystem.isDir(appPaths[path]))) FileSystem.mkdir(appPaths[path]).catch(err => console.log(err));
    }
}

export { basePath, appPaths, appFileNames, folderNames, initializeApp };
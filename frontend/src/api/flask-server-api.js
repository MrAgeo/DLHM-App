/**
 * Interface to the Flask Server
 */

import { Alert } from 'react-native';
import ReactNativeBlobUtil from "react-native-blob-util";

import { getFlaskURL } from '../config/constants';
import { fetch2, createDLHMImageFormData, generateUniqueFileName } from "../utils";
import { appFileNames, appPaths } from '../features/app';

/**
 * API to communicate to the Flask Server
 */
class FlaskServerApi {
    /**
     * Adds an item to the server list
     * @param name Name of the item
     * @returns {*|Promise<any>}
     * @constructor
     */
    
    static UploadDLHM(holoPath, refPath) {
      return fetch2("dlhm/upload",
          {
              method: "POST",
              body: createDLHMImageFormData(holoPath, refPath)
          })
          .then(res => res.json())
          .catch(err => {
            console.log("upload error", err);
            Alert.alert("Error", "Upload failed! Please try again.");
            return null;
          });
    }

    static async GetReconstruction() {
      const res = await ReactNativeBlobUtil
             .config({
               path: `${appPaths.recPath}/${generateUniqueFileName(appFileNames.recFileName)}`
             })
             .fetch('GET', `${getFlaskURL()}/dlhm/get-reconstruction`)
      return res;
    }

    static CreateReconstruction(opts) {
      return fetch2("dlhm/create-reconstruction",
        {
          method: 'POST',
          headers: {'Content-type': 'application/json'},
          body: JSON.stringify(opts)
        });
    }

    static Ping(url) {
      return fetch(`${url}/ping`)
    }
}

export default FlaskServerApi;

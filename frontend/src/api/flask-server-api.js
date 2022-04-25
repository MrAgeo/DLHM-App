/**
 * Interface to the Flask Server
 */

import { fetch2 } from "../utils/helpers";

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
    static InsertItem(name) {
        return fetch2('/items',
            {
                'method': 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(name)
            })
            .then(res => res.json()).catch(err => {
                alert("Error by items POST!");
                console.log(err);
            })
    }
}

export default FlaskServerApi;

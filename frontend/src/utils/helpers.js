/**
 * Library with some helper functions
 */

// URL of the Flask Server
const flaskURL = "http://192.168.1.3:5000";

/**
 * Wrapper of 'fetch'
 * @param route Route to fetch
 * @param [options] Optional parameters passed to the function 'fetch'
 * @returns {*|Promise<any>}
 */
const fetch2 = (route, options) => {
    return fetch(flaskURL + route, options);
}

/**
 * Displays an object as JSON via the logger function
 * @param obj The object
 * @param logger The logger function to use.
 * @returns {*}
 */
const displayObject = (obj, logger=console.log) => {
    logger(JSON.stringify(obj))
}
export {fetch2, displayObject};

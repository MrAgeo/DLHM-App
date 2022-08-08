/**
 * Library with some helper functions
 */

import React, { useMemo, useState } from "react";
import { Util } from 'react-native-file-access';

import { getFlaskURL } from "../config/constants";

/**
 * Wrapper of 'fetch'
 * @param route Route to fetch
 * @param [options] Optional parameters passed to the function 'fetch'
 * @returns {*|Promise<any>}
 */
const fetch2 = (route, options) => {
    return fetch(`${getFlaskURL()}/${route}`, options);
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

// React util functions
/**
 * Verifies if an object is a React Class Component.
 * @param {*} component
 * @returns {boolean} `true` if the object is a React Class Component.
 */
function isClassComponent(component) {
    return (
        typeof component === 'function' &&
        !!component.prototype.isReactComponent
    )
}

/**
 * Verifies if an object is a React Function Component.
 * @param {*} component
 * @returns {boolean} `true` if the object is a React Function Component.
 */
function isFunctionComponent(component) {
    return (
        typeof component === 'function' &&
        String(component).includes('return React.createElement')
    )
}

/**
 * Verifies if an object is a React Component.
 * @param {*} component
 * @returns {boolean} `true` if the object is a React Component.
 */
function isReactComponent(component) {
    return (
        isClassComponent(component) ||
        isFunctionComponent(component)
    )
}

/**
 * Verifies if an object is a React Element.
 * @param {*} element
 * @returns {boolean} `true` if the object is a React Element.
 */
function isElement(element) {
    return React.isValidElement(element);
}

/**
 * Verifies if an object is a React DOM Element.
 * @param {*} element
 * @returns {boolean} `true` if the object is a React DOM Element.
 */
function isDOMTypeElement(element) {
    return isElement(element) && typeof element.type === 'string';
}

/**
 * Verifies if an object is a React Composite Element.
 * @param {*} element
 * @returns {boolean} `true` if the object is a React Composite Element.
 */
function isCompositeTypeElement(element) {
    return isElement(element) && typeof element.type === 'function';
}


function useToggle(enabled = true) {
    const [state, setState] = useState(enabled);

    const handlers = useMemo(
        () => ({
            on: () => setState(true),
            off: () => setState(false),
            toggle: () => setState(!state),
        }),
    [],
  );

  return { enabled: state, ...handlers };
}

const createDLHMImageFormData = (holoPath, refPath) => {
    const data = new FormData();
    
    data.append("holo", {
        name: Util.basename(holoPath),
      type: "image/" + Util.extname(holoPath),
      uri: "file://" + holoPath
    });

    if (refPath !== null){
        data.append("ref", {
            name: Util.basename(refPath),
            type: "image/" + Util.extname(refPath),
            uri: "file://" + refPath
        });
    }
    return data;
};


const createDLHMParametersFormData = (opts, holoType="inten") => {
    const data = new FormData();

    opts["out_holo_type"] = holoType;
    
    data.append("options", {
        name: "options",
        type: "application/json",
        data: JSON.stringify(opts)
        });
    
    return data;
};

const createImg = (path) => {
    return {uri: `file://${path}`, cache: 'reload'}
}

const generateUniqueFileName = (fname) => `${Date.now()}-${fname}`;

const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);

export { fetch2, createDLHMImageFormData,createDLHMParametersFormData,
         displayObject, isReactComponent, isFunctionComponent,
         isClassComponent, isElement, isCompositeTypeElement,
         isDOMTypeElement, useToggle, isNumeric, createImg,
         generateUniqueFileName };

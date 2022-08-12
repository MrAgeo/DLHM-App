import { Dimensions } from "react-native";
import { saveFlaskURL } from "../features/app";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const maxFontSize = 0.175 * windowWidth;


// URL of the Flask Server
let flaskURL = "http://192.168.1.3:80";
const getFlaskURL = () => flaskURL;
const setFlaskURL = val => {flaskURL = val; saveFlaskURL();};
export { windowWidth, windowHeight, maxFontSize, getFlaskURL, setFlaskURL };

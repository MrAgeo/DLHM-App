import { Dimensions } from "react-native";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;


// TODO: Configurable Flask URL
// URL of the Flask Server
let flaskURL = "http://192.168.1.3:80";
const getFlaskURL = () => flaskURL;
const setFlaskURL = val => {flaskURL = val};
export { windowWidth, windowHeight, getFlaskURL, setFlaskURL };

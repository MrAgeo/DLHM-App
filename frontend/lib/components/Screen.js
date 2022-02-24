/**
 * Screen Component
 */
import {View, Text} from "react-native";
import styles from './css/screen.sass'
import {Separator} from "./Minicomponents";

/**
 *
 * @param props Properties passed as an object
 * @returns {JSX.Element} The Screen Component
 * @constructor
 */
const Screen = (props) => {
    return (
        <View style={styles.screenContainer} key={props.id}>
            <View style={styles.screenTitle}>
                <Text style={styles.title}>{props.title}</Text>
                <Separator/>
            </View>
            <View style={styles.screenContent}>
                {props.children}
            </View>
        </View>
    );
}

export default Screen;

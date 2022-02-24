/**
 * Main App.
 */

//  React Imports
import PagerView from "react-native-pager-view";
import React, {useState, useEffect} from 'react';
import {StatusBar} from 'expo-status-bar';
import {Image, StyleSheet, Text, View, TouchableOpacity, Button} from 'react-native';
import sheldon from './assets/sheldon_xmas.png';
import styles from './css/app.sass';

// Custom imports
import {fetch2} from "./lib/helpers"
import ItemList from "./lib/components/ItemList";
import APIService from "./lib/APIService";
import Screen from "./lib/components/Screen";

// Counter to create items
let counter = 1;

/**
 * Initializes and creates the app
 * @returns {JSX.Element} The app itself
 * @constructor
 */
export default function App() {

    // Getters and setters for currentTime and items
    const [currentTime, setCurrentTime] = useState(0);
    const [items, setItems] = useState([]);

    /**
     * Gets the time from the server and sets the 'currentTime' variable with its value
     */
    const getTime = () => {
        fetch2('/time').then(res => res.json()).then(data => {
            setCurrentTime(data.time);
        });
    }

    /**
     * Gets the items list from server and sets the 'items' variable with its value
     */
    const getItems = () => {
        fetch2('/items'
            /*,     // Is this required?
                {
                'methods': 'GET',
                headers: {'Content-Type': 'application/json'}
            }*/
        ).then(res => res.json()).then(res => setItems(res))
            .catch(err => {
                alert('Error by items GET!');
                console.log(err);
            })
    }
    /**
     * Resets the server's item list
     */
    const resetItems = () => {
        fetch2('/reset'
            /*,     // Is this required?
                {
                'methods': 'GET',
                headers: {'Content-Type': 'application/json'}
            }*/
        ).catch(err => {
            alert('Error by items reset!');
            console.log(err);
        })
    }

    /**
     * Adds an item to the server's list via HTTP POST and syncs the local list with the server
     */
    const addItem = () => {
        APIService.InsertItem("React " + counter)
            .then(res => {
                const new_items = [...items, res];
                setItems(new_items);
            }).catch(err => {
            alert('Error by items POST receive!');
            console.log(err);
        })
        counter++;
    }

    // Update values on app init
    useEffect(getTime, []);
    useEffect(resetItems, []);
    useEffect(getItems, []);

    // Create App Layout consisting of 3 pages inside a PagerView
    return (
        <View style={styles.container}>
            <PagerView style={{flex: 1, justifyContent: "space-evenly"}} initialPage={0}
                       pageMargin={2}>
                <Screen title={"Hola Mundo!"} id="1">
                    <Text style={styles.grayText}>Swipe right!</Text>
                    <Image source={sheldon} style={styles.sheldon_img}/>
                </Screen>
                <Screen title={"Current Time"} id="2">
                    <Text style={styles.blackText}>
                        Current time is {currentTime}
                    </Text>
                    <TouchableOpacity
                        onPress={getTime}
                        style={styles.btn}>
                        <Text style={styles.btnText}>Update time</Text>
                    </TouchableOpacity>
                </Screen>
                <Screen title={"Item List"} id="3">
                    <Text style={styles.grayText}>Total items: {items.length}</Text>
                    <Text style={styles.blackText}>Scrollable list!</Text>
                    <ItemList style={{marginBottom: 90}} items={items}/>
                    <View style={styles.btnContainer}>
                        <Button onPress={addItem} title="Add Item"/>
                        <Button onPress={() => {
                            resetItems();
                            getItems()
                        }} title="Reset List"/>
                    </View>
                </Screen>
            </PagerView>
            <StatusBar style="auto"/>
        </View>
    );
}

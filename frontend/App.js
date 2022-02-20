import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import sheldon from './assets/sheldon_xmas.png'
import styles from './css/app.sass'

export default function App() {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch('http://192.168.1.3:5000/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

  return (
    <View style={styles.container}>

      <Text style={styles.helloTxt}>Hola Mundo</Text>
      <Text>Time is {currentTime}</Text>
      <Image source={sheldon} style={styles.sheldon_img}></Image>
      <TouchableOpacity
        onPress={() => alert('Hola Mundo!')}
        style={styles.btn }>
        <Text style={ styles.btnText }>Hello</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}
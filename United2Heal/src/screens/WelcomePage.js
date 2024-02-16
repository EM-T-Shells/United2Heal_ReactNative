import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const WelcomePage = ({ navigation }) => {

    // Handle Volunteer button press
    const handleVolunteerPress = () => {
      navigation.navigate('VolunteerLogin');
      console.log('Volunteer button pressed');
    };

    // Handle Admin button press
    const handleAdminPress = () => {
      navigation.navigate('AdminScreen');
      console.log('Admin button pressed');
    };

  return (
    <View style={styles.container}>
        <Image
            source={require('./assets/img/u2hlogo.png')}
            style={styles.image}
        />
        <Text style={styles.title}>United2Heal</Text>
        <Text style={styles.description}>Please select between the options below:</Text>
        <TouchableOpacity
            style={styles.button}
        >
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.adminButton]} onPress={handleAdminPress}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
            <Icon name="user-md" size={24} color="#000000" style={{marginRight:8}} solid/>
            <Text style={styles.buttonText}>Admin</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.adminButton]} onPress={handleVolunteerPress}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
            <Icon name="user" size={24} color="#000000" style={{marginRight:8}} solid/>
            <Text style={styles.buttonText}>Volunteer</Text>
            </View>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: 'black',
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    color: 'black',
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  adminButton: {
    backgroundColor: '#4285F4',
  },
});

export default WelcomePage;




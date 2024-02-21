// AdminScreen.js

import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, ActivityIndicator, StyleSheet, Alert, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import U2HConfigNode from '../U2HConfigNode';

const AdminScreen = ({ onLogin}) => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [correctPassword, setCorrectPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getCorrectPassword = async () => {
    setIsLoading(true); // Set loading to true when we start the API call
    try {
      const response = await fetch(
        'https://lsmtrmi3d9.execute-api.us-east-1.amazonaws.com/getAdminPassword'
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const password = data.map(item => item.Password);
      setCorrectPassword(password[0]);

    } catch (error) {
      console.log(error.message);
      Alert.alert('Error', error.message); // Show the actual error message
    } finally {
      setIsLoading(false); // Set loading to false when the API call is finished
    }
  };
  
  const handleLogin = () => {
    if (password !== correctPassword) {
      Alert.alert('Error', 'Incorrect password. Please try again.');
    } else {
      U2HConfigNode.setVolunteerName(username);
      onLogin();
      console.log('Submit button pressed');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
        // Logic to execute when the screen is focused
        getCorrectPassword();
    });

    // Return the cleanup function
    return unsubscribe;
}, [navigation]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <View style={styles.container}>
      {isLoading && 
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      }
      <Text style={styles.pageTitle}>United2Heal</Text>
      <Image
            source={require('../img/u2hlogo.png')}
            style={styles.image}
        />
      <Text style={styles.title}>Admin Login</Text>
      <Text style={styles.label}>Username:</Text>
      <TextInput 
        style={styles.input} 
        value={username} 
        onChangeText={(text) => setUsername(text)} 
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput 
        style={styles.input} 
        value={password} 
        onChangeText={(text) => setPassword(text)} 
        secureTextEntry
      />
        <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={() => handleLogin()}>
                <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
    </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  buttonsContainer: {
    flex: 0,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
  },
  pageTitle: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: 'black',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  button: {
    width: '75%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: 8,
    backgroundColor: '#4285F4',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    width: '85%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 40,
    padding: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
    zIndex: 10  // Ensure the overlay is above all other components
  },
});

export default AdminScreen;

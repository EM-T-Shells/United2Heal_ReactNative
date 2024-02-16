import React, { useState } from 'react';
import { Button, View, Text, StyleSheet, TextInput, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';


const AddItemTab = () => {

  const [itemName, setItemName] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // New state variable for loading
  const icon = <Icon name={'comments'} solid />;
  
  const addItem = async () => {
    if (!itemName.trim()) {  // If itemName is empty or only contains whitespace
      Alert.alert('Error', 'Please enter an item name');  // Show an error and return early
      return;
    }
    setIsLoading(true);  // Set loading to true when we start the API call
    try {
      const response = await fetch(`https://5w40cpglj6.execute-api.us-east-1.amazonaws.com/?ItemName=${itemName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      Alert.alert('Success', 'Item added successfully');
      setItemName('');  // Reset the text box to be empty
    } catch (error) {
      Alert.alert('Error', error.message);  // Show the actual error message
    } finally {
      setIsLoading(false);  // Set loading to false when the API call is finished
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (  // If loading, display the loading screen
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (  // Otherwise, display the normal content
        <>
          <Text style={styles.title}>Add a new item</Text>
          <Text style={styles.paragraph}>After you've added this item, you can search for it and insert it to a Box.</Text>
          <TextInput  style={styles.input}  onChangeText={setItemName}  value={itemName}  placeholder="Item Name"/>
          <TouchableOpacity style={styles.button} onPress={addItem}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Submit</Text>
            </View>
          </TouchableOpacity>

        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: 'black',
  },
  paragraph: {
    fontSize: 18,
    fontWeight: '300',
    marginBottom: 48,
    textAlign: 'center',
    color: 'black',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: 'black',
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },  
  icon: {
    marginRight: 10,  
  },
});

export default AddItemTab;

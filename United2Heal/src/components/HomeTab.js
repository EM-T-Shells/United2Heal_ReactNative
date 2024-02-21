import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import U2HConfigNode from '../U2HConfigNode';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const HomeTab = () => {
  const navigation = useNavigation();
  const volunteerName = U2HConfigNode.getVolunteerName();
  const groupName = U2HConfigNode.getGroupName();
  
  const [volunteerItemCount, setVolunteerItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const todayDate = formatDate(new Date());

  const instructions = `
1. Search for the item you have picked up, if the item doesn't appear add it in the Add Item tab.

2. Once you've found the item, enter the important information like quantity, expiration date, and box number.

3. Verify the information is correct and submit the item in the box.

4. Watch your submitted items grow!
    `;

  const loadItemCount = async (date) => {
    try {
      const count = await AsyncStorage.getItem(date);
      if (count !== null) {
        setVolunteerItemCount(parseInt(count));
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading item count:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsLoading(true);
      loadItemCount(todayDate);
    });
    // Return the cleanup function
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {isLoading && 
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      }
      <View style={styles.outline}>
        <Text style={styles.title}>Welcome {volunteerName}!</Text>
        <Text style= {styles.description}>Group: {groupName}</Text>
      </View>
      <View style={styles.outline}>
       <Text style= {styles.submittedItems}>Instructions!</Text>
       <Text style= {styles.summary}>{instructions}</Text>
      </View>
      <View style={styles.outline}>
       <Text style= {styles.submittedItems}>Submitted Items</Text>
       <Text style= {styles.itemCount}>{volunteerItemCount}</Text>
      </View>
    </View> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  outline: {
    borderColor: 'black',
    borderWidth: 1,
    marginTop: 8,
    alignItems: 'center',
    padding: 16,
    width: '85%',
  },
  title: {
    fontSize: 32,
    color: '#0000FF', 
    fontWeight: 'bold',
    color: 'blue',
  },
  description: {
    fontSize: 20, 
    marginTop: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  summary: {
    fontSize: 13,
    textAlign: 'justify',
    color: 'black',
  },
  submittedItems: {
    fontSize: 28,
    color: 'black',
  },
  itemCount: {
    fontSize: 40,
    marginTop: 10,
    color: 'black',
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

export default HomeTab;
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Switch } from 'react-native';
import U2HConfigNode from '../../U2HConfigNode';
import { useNavigation } from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const AdminHomeTab = () => {
  const volunteerName = U2HConfigNode.getVolunteerName();
  const groupName = U2HConfigNode.getGroupName();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [appStatus, setAppStatus] = useState(0);
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleAppStatus = async () => {
    setIsLoading(true); // Set loading to true when we start the API call
    try {
      const response = await fetch(
        'https://2ica4a9lh5.execute-api.us-east-1.amazonaws.com/toggleAppStatus'
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAppStatus(data);
      setIsEnabled(previousState => !previousState);
    } catch (error) {
      console.log(error.message);
      Alert.alert('Error', error.message); // Show the actual error message
    } finally {
      setIsLoading(false); // Set loading to false when the API call is finished
    }
  };

  const getAppStatus = async () => {
    setIsLoading(true); // Set loading to true when we start the API call
    try {
      const response = await fetch(
        'https://4em2zegc7d.execute-api.us-east-1.amazonaws.com/getAppStatus'
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const currentAppStatus = data.map(item => item.AppStatus);
      setAppStatus(currentAppStatus);
      setIsEnabled(currentAppStatus == 1);
    } catch (error) {
      console.log(error.message);
      Alert.alert('Error', error.message); // Show the actual error message
    } finally {
      setIsLoading(false); // Set loading to false when the API call is finished
    }
  };

  const appStatusText = appStatus == 1 ? 
  "The app is currently Active for Volunteers to submit items! Click on the switch to disable the app." : 
  "The app is currently Disabled for Volunteers to submit items! Click on the switch to enable the app.";
 
  const getSubmittedItemCount = async () => {
    setIsLoading(true); // Set loading to true when we start the API call
    try {
      const response = await fetch(
        'https://yo0l9v1cf4.execute-api.us-east-1.amazonaws.com/getTodaysItemCount'
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const count = await response.json();
      setItemCount(count);
      getAppStatus();
    } catch (error) {
      console.log(error.message);
      Alert.alert('Error', error.message); // Show the actual error message
    } finally {
      setIsLoading(false); // Set loading to false when the API call is finished
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getSubmittedItemCount();
    });
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
      </View>
      <View style={styles.outline}>
       <Text style= {styles.submittedItems}>Total Submitted Items</Text>
       <Text style= {styles.summary}>This is a count of all the items submitted by Volunteers today</Text>
       <Text style= {styles.itemCount}>{itemCount}</Text>
      </View>
      <View style={styles.outline}>
       <Text style= {styles.submittedItems}>App Status</Text>
       <Text style= {styles.summary}>{appStatusText}</Text>
       <Switch
        style={{marginVertical: 10}}
        trackColor={{false: '#767577', true: 'green'}}
        thumbColor={isEnabled ? 'white' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleAppStatus}
        value={isEnabled}
      />
      <Text style={{fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: appStatus == 1 ? 'green' : 'red'}}>
        {appStatus == 1 ? 'Active' : 'Disabled'}
      </Text>
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
    marginTop: 32,
    alignItems: 'center',
    padding: 16,
    width: '85%',
  },
  title: {
    fontSize: 32,
    color: '#0000FF', 
    fontWeight: 'bold'
  },
  description: {
    fontSize: 20, 
    marginTop: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  submittedItems: {
    fontSize: 28,
    color:'black',
  },
  summary: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    color: 'black',
  },
  itemCount: {
    fontSize: 60,
    marginTop: 20,
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

export default AdminHomeTab;
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native';
import BottomSheet, { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import Icon from 'react-native-vector-icons/FontAwesome5';
import U2HConfigNode from '../../U2HConfigNode';
import Divider from './Divider';
import { ScrollView } from 'react-native-gesture-handler';

const VolunteerLogin = ({ onLogin }) => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null); // Create a ref for the BottomSheet

  const [volunteerName, setVolunteerName] = useState('');
  const [selectedGroupName, setSelectedGroupName] = useState('A');
  const [isGroupNameSelected, setisGroupNameSelected] = useState(false);
  const [groupNames, setGroupNames] = useState('');
  const [appStatus, setAppStatus] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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
    } catch (error) {
      console.log(error.message);
      Alert.alert('Error', error.message); // Show the actual error message
    } finally {
      setIsLoading(false); // Set loading to false when the API call is finished
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
        getAppStatus();
    });
    return unsubscribe;
}, [navigation]);

  const snapPoints = useMemo(() => ["40%"], []);

  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

  const handleCloseIconPress = () => {
    closeBottomSheet(); // Close the bottom sheet when the icon is pressed
  };

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const renderItem = useCallback(
    ({ item }) => (
      <View>
        <TouchableOpacity style={styles.groupItem} onPress={() => {
          setSelectedGroupName(item); // Update selected group name
          setisGroupNameSelected(true);
          U2HConfigNode.setGroupName(item);
          closeBottomSheet(); // Close the bottom sheet
        }}>
          <Text style={styles.groupText}>{item}</Text>
        </TouchableOpacity>
        <Divider/>
      </View>
    ),
    []
  );

  const handleGoBackPress = () => {
    // Handle Go Back button press
    navigation.goBack();
    console.log('Go back button pressed');
  };

  const handleSubmitPress = () => {
    if (appStatus == 0) {
      Alert.alert('App not active!', 'A Unted2Heal Admin has not set the app to active yet. Talk to an admin for more info!');
      return;
    }
    // Handle Submit button press
    if (volunteerName.length <= 1) {
      Alert.alert('Invalid Name', 'Please enter a valid name.');
      return;
    }
    if (!isGroupNameSelected) {
      Alert.alert('Select group', 'Please select a group.');
      return;
    }
    U2HConfigNode.setVolunteerName(volunteerName);
    onLogin();
    console.log('Submit button pressed');
  };
  const getVolunteerLoginGroups = async () => {
    Keyboard.dismiss();
    if (groupNames.length > 0) {
      openBottomSheet();
    } 
    else {
      setIsLoading(true);
      try {
        const response = await fetch(`https://0nwtnszk97.execute-api.us-east-1.amazonaws.com/getVolunteerLoginGroups`);
        if (!response.ok) { 
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const groups = data.map(item => item.GroupName);
        setGroupNames(groups);
        openBottomSheet();
      } catch (error) {
        Alert.alert('Error', error.message);  // Show the actual error message
      } finally {
        setIsLoading(false); // <-- Ensure loading stops after the fetch
      }
    }
  };


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
            source={require('./assets/img/u2hlogo.png')}
            style={styles.image}
        />
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Volunteer Login</Text>
          <Text style={styles.description}>Please Enter Your Name:</Text>
          <TextInput 
          style={styles.input} 
          value={volunteerName} 
          onChangeText={(text) => setVolunteerName(text)} 
          />
          <Text style={styles.description}>Please select a Group </Text>
          <TouchableOpacity style={styles.dropdownContainer} onPress={getVolunteerLoginGroups}>
            <Text style={styles.dropdownText}>{isGroupNameSelected ? selectedGroupName : 'Select Group'}</Text>
            <Icon style={{ position: 'absolute', right: 12}} name='caret-down' size={22} color='#000000'/>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleGoBackPress}>
                <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={() => handleSubmitPress()}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    </View>
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChange}
    >
      <View style={styles.bottomSheetTitleContainer}>
        <Text style={styles.dropdownText}>Select Group</Text>
        <TouchableOpacity style={{ position: 'absolute', right: 12}} onPress={handleCloseIconPress}>
          <Icon  name="times" size={18} color="black" />
        </TouchableOpacity>
      </View>

      <BottomSheetSectionList
        sections={[{ title: 'Select Group', data: groupNames }]}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}
      />
    </BottomSheet>
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
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  groupItem: {
    alignItems: 'center',
    marginTop: 4
  },
  groupText: {
    marginTop: 8,
    fontSize: 18,
    color: 'black',
  },
  bottomSheetTitleContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 40,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  dropdownContainer: {
    flexDirection: 'row',
    borderColor: 'black',
    width: '85%',
    height: 40,
    borderWidth: 1,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  buttonsContainer: {
    flex: 0,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    marginTop: 32
  },
  pageTitle: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: 'black',
  },
  description: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  dropdownText: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  button: {
    width: '50%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#4285F4',
  },
  cancelButton: {
    backgroundColor: '#D3D3D3',
  },
  input: {
    height: 40,
    width: '85%',
    borderWidth: 1,
    borderColor: 'black',
    flexDirection: 'column',
    marginVertical: 12,
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

export default VolunteerLogin;
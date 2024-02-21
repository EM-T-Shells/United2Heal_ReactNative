import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { View, Alert, ActivityIndicator, Text, TextInput, Button, TouchableOpacity, Modal, StyleSheet, InputAccessoryView, Keyboard } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomSheet, { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import U2HConfigNode from '../U2HConfigNode';
import Divider from '../components/Divider';
import AsyncStorage from '@react-native-async-storage/async-storage';

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const ItemPage = ({ route }) => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null); // Create a ref for the BottomSheet

  const { itemName, itemId } = route.params;

  const [quantity, setQuantity] = useState('');
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [noExpiration, setNoExpiration] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [boxNumbers, setBoxNumbers] = useState('');
  const [selectedBoxNumber, setSelectedBoxNumber] = useState('');
  const [isBoxNumberSelected, setIsBoxNumberSelected] = useState(false);
  const GroupName = U2HConfigNode.getGroupName();

  const [volunteerItemCount, setVolunteerItemCount] = useState(0);
  const todayDate = formatDate(new Date());

  const [appStatus, setAppStatus] = useState(0);

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
      setIsLoading(true);
      setQuantity('');
      setNoExpiration(true);
      setIsBoxNumberSelected(false);
      loadItemCount(todayDate);
      getAppStatus();
    });
    // Return the cleanup function
    return unsubscribe;
}, [navigation]);

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

const incrementCount = async () => {
  try {
    const newCount = volunteerItemCount + 1;
    setVolunteerItemCount(newCount);
    await AsyncStorage.setItem(todayDate, newCount.toString());
  } catch (error) {
    console.error('Error saving item count:', error);
  }
};

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
        <TouchableOpacity style={styles.boxNumberItem} onPress={() => {
          setSelectedBoxNumber(item); // Update selected group name
          setIsBoxNumberSelected(true);
          closeBottomSheet(); // Close the bottom sheet
        }}>
          <Text style={styles.boxNumberText}>{item}</Text>
        </TouchableOpacity>
        <Divider/>
      </View>
    ),
    []
  );

  const getBoxNumbers = async () => {
    if (boxNumbers.length > 0) {
      openBottomSheet();
    } 
    else {
      setIsLoading(true);
      try {
        const response = await fetch(`https://l2glmsg7jb.execute-api.us-east-1.amazonaws.com/?GroupName=${U2HConfigNode.getGroupName()}`);
        if (!response.ok) { 
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const boxNumbers = data.map(item => item.BoxNumber);
        setBoxNumbers(boxNumbers);
        openBottomSheet();
      } catch (error) {
        Alert.alert('Error', error.message);  // Show the actual error message
      } finally {
        setIsLoading(false); // <-- Ensure loading stops after the fetch
      }
    }
  };

  const handleSubmit = async () => {
    if (appStatus == 0) {
      Alert.alert('App not active!', 'A Unted2Heal Admin has not set the app to active yet. Talk to an admin for more info!');
      return;
    }
    // Check if all fields are filled
    if (!itemName || !itemId || !quantity || (!noExpiration && !expirationDate) || !isBoxNumberSelected) {
        Alert.alert('Error', 'Please fill in all fields.');
        return;
    }
    // Construct the item details string for the confirmation alert
    const itemDetails = `
Item Name: ${itemName}

Item Quantity: ${quantity}

Expiration Date: ${noExpiration ? 'None' : expirationDate.toDateString()}

Item Box: ${selectedBoxNumber}
    `;

    // Construct the API endpoint with the required parameters
    const apiUrl = `https://6o9shphxm2.execute-api.us-east-1.amazonaws.com/?ItemID=${itemId}&GroupName=${GroupName}&BoxNumber=${selectedBoxNumber}&ItemName=${itemName}&ItemQuantity=${quantity}&ExpirationDate=${noExpiration ? 'None' : expirationDate.toISOString()}&School=VCU`;

    // Show a confirmation alert before proceeding
    Alert.alert(
        'Confirm Submission',
        `Are you sure you want to submit the following item?\n\n${itemDetails}`,
        [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'OK',
                onPress: async () => {
                    try {
                        setIsLoading(true);

                        // Your existing code to make the API call
                        const response = await fetch(apiUrl, {
                            method: 'POST'
                        });

                        // Handle response and errors as before
                        if (response.ok) {
                            // Success alert
                            Alert.alert(
                                'Success',
                                `Successfully submitted ${itemName} into Box ${GroupName} ${selectedBoxNumber}`,
                                [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
                            );
                            incrementCount();
                            setIsLoading(false);
                        } else {
                            Alert.alert('Error', 'Failed to submit the item. Please try again.');
                        }
                    } catch (error) {
                        Alert.alert('Error', 'An error occurred. Please check your connection and try again.');
                    } finally {
                        setIsLoading(false);
                    }
                }
            }
        ]
    );
};

  return (
    <>
    <View style={styles.container}>
      {isLoading && 
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      }
      <Text style={styles.headerText}>Item Name:</Text>
      <Text style={styles.descriptionText}>{itemName}</Text>

      <Text style={styles.headerText}>Item ID:</Text>
      <Text style={styles.descriptionText}>{itemId}</Text>

      <Text style={styles.headerText}>Item Quantity:</Text>
      <Text style={styles.descriptionText}>Enter the quantity of the item.</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Item Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        inputAccessoryViewID="Done"
      />
        <Text style={styles.headerText}>Expiration Date:</Text>
      <Text style={styles.descriptionText}>Select the expiration date of the item.</Text>
      <TouchableOpacity style={styles.dateBox} onPress={() => setShowDatePicker(true)}>
        <Text>{noExpiration ? "No Expiration" : expirationDate.toDateString()}</Text>
        <Icon name="caret-down" size={16} style={styles.dropdownIcon} />
      </TouchableOpacity>
      
      <View style={styles.checkboxContainer}>
        <Icon name={noExpiration ? 'check-square' : 'square'} size={20} onPress={() => {
          setNoExpiration(!noExpiration);
          if (!noExpiration) {
            setShowDatePicker(false);
            setExpirationDate(new Date());
          }
        }} />
        <Text style={{marginLeft: 10}} >No Expiration</Text>
      </View>

      <Text style={styles.headerText}>Item Box:</Text>
      <Text style={styles.descriptionText}>Select the box you're putting the item in.</Text>
      <TouchableOpacity style={styles.dropdownContainer} onPress={getBoxNumbers}>
        <Text style={styles.dropdownText}>{isBoxNumberSelected ? selectedBoxNumber : 'Select Box Number'}</Text>
        <Icon style={{ position: 'absolute', right: 12}} name='caret-down' size={22} color='#000000'/>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <DatePicker
            date={expirationDate}
            onDateChange={setExpirationDate}
            mode="date"
          />
          <Button title="Done" onPress={() => setShowDatePicker(false)} />
        </View>
      </Modal>
    </View>
    <InputAccessoryView nativeID="Done">
      <View style={styles.accessory}>
        <Button
          onPress={() => Keyboard.dismiss()}
          title="Done"
        />
      </View>
    </InputAccessoryView>
    <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
      >
        <View style={styles.bottomSheetTitleContainer}>
          <Text style={styles.dropdownText}>Select Box Number</Text>
          <TouchableOpacity style={{ position: 'absolute', right: 12}} onPress={handleCloseIconPress}>
            <Icon  name="times" size={18} color="black" />
          </TouchableOpacity>
        </View>
        <BottomSheetSectionList
          sections={[{ title: 'Select Box Number', data: boxNumbers }]}
          keyExtractor={(item) => item}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
        />
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#ffffff"
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 18,  
    marginTop: 20,
    color: 'black',
  },
  descriptionText: {
    fontStyle: 'italic',
    fontSize: 12,
    color: '#777',
    marginBottom: 5,
    color: 'black',
  },
  input: {
    backgroundColor: 'white',
    borderColor: '#ccc',
    marginTop: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 5,
    color: 'black',
  },
  dropdownContainer: {
    flexDirection: 'row',
    borderColor: '#ccc',
    borderRadius: 5,
    borderWidth: 1,
    height: 40,
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Changing the background color to white
    margin: 20, 
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
  },
  dropdownIcon: {
    marginLeft: 10,
  },
  boxNumberItem: {
    alignItems: 'center',
    marginTop: 4
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
  boxNumberText: {
    marginTop: 8,
    fontSize: 18,
    color: 'black',
  },
  dropdownText: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  button: {
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
  accessory: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 8
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

export default ItemPage;


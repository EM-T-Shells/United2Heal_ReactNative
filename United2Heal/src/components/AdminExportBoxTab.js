import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { CommonActions } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import BottomSheet, { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import Divider from './Divider';
import GoogleSheetsPage from '../screens/GoogleSheetsPage'; 


const AdminExportBoxTab = () => {
  const navigation = useNavigation();
  const groupNamesBottomSheetRef = useRef(null);
  const boxNumbersBottomSheetRef = useRef(null);

  const [selectedGroupName, setSelectedGroupName] = useState('A');
  const [isGroupNameSelected, setIsGroupNameSelected] = useState(false);
  const [groupNames, setGroupNames] = useState('');

  const [selectedBoxNumber, setSelectedBoxNumber] = useState('1');
  const [isBoxNumberSelected, setIsBoxNumberSelected] = useState(false);
  const [boxNumbers, setBoxNumbers] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const snapPoints = useMemo(() => ["40%"], []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSelectedGroupName('A'); // Reset selected group name to default
      setIsGroupNameSelected(false); // Reset group selection status
      setIsSubmitDisabled(true); // Disable submit button
      setSelectedBoxNumber('1'); // Reset selected box number
      setIsBoxNumberSelected(false); // Reset box number selection status
    });
    // Return the cleanup function
    return unsubscribe;
  }, [navigation]);

  const handleGroupSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

  const handleBoxSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

  const handleCloseIconPress = (bottomSheetRef) => {
    closeBottomSheet(bottomSheetRef); // Close the bottom sheet when the icon is pressed
  };

  const openBottomSheet = (bottomSheetRef) => {
    bottomSheetRef.current?.expand();
  };

  const closeBottomSheet = (bottomSheetRef) => {
    bottomSheetRef.current?.close();
  };

  const renderGroupItem = useCallback(
    ({ item }) => (
      <View>
        <TouchableOpacity style={styles.groupItem} onPress={() => {
          setSelectedGroupName(item);
          setIsGroupNameSelected(true);
          setIsSubmitDisabled(false); // Enable submit button
          closeBottomSheet(groupNamesBottomSheetRef);
          setSelectedBoxNumber('1'); // Reset selected box number
          setIsBoxNumberSelected(false); // Reset box number selection status
        }}>
          <Text style={styles.groupText}>{item}</Text>
        </TouchableOpacity>
        <Divider />
      </View>
    ),
    []
  );

  const renderBoxItem = useCallback(
    ({ item }) => (
      <View>
        <TouchableOpacity style={styles.groupItem} onPress={() => {
          setSelectedBoxNumber(item);
          setIsBoxNumberSelected(true);
          setIsSubmitDisabled(false); // Enable submit button
          closeBottomSheet(boxNumbersBottomSheetRef);
        }}>
          <Text style={styles.groupText}>{item}</Text>
        </TouchableOpacity>
        <Divider />
      </View>
    ),
    []
  );

  //reset box number selection status
  const getGroupNames = async () => {
    if (groupNames.length > 0) {
      openBottomSheet(groupNamesBottomSheetRef);
    }
    else {
      setIsLoading(true);
      try {
        const response = await fetch(`https://nmlzvnme7h.execute-api.us-east-1.amazonaws.com/getAllGroups`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const groups = data.map(item => item.GroupName);
        setGroupNames(groups);
        openBottomSheet(groupNamesBottomSheetRef);
      } catch (error) {
        Alert.alert('Error', error.message);  // Show the actual error message
      } finally {
        setIsLoading(false); // <-- Ensure loading stops after the fetch
      }
    }
  };

  const getBoxNumbers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://ktmkdjyf67.execute-api.us-east-1.amazonaws.com/getAllBoxes?groupName=${selectedGroupName}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      const boxes = Array.from(new Set(data.map(item => item.BoxNumber))); 
      setBoxNumbers(boxes);
      openBottomSheet(boxNumbersBottomSheetRef);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };  

  const handleSubmit = async () => {
    if (!isBoxNumberSelected || !isGroupNameSelected) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    // Construct the item details string for the confirmation alert
    const itemDetails = `
    Group Name: ${selectedGroupName}  
    Box Number: ${selectedBoxNumber}
    `;
  
    // Change to the URL of your AWS Lambda function for exporting to Google Sheets
    const exportApiUrl = `https://s0jdg70bp9.execute-api.us-east-1.amazonaws.com/?groupName=${selectedGroupName}&boxNumber=${selectedBoxNumber}`;
  
    Alert.alert(
      'Confirm Submission',
      `Are you sure you want to Export the following box?\n\n${itemDetails}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: async () => {
            try {
              setIsLoading(true);
    
              const response = await fetch(exportApiUrl, {
                method: 'POST',
              });
              console.log(response);
    
              // Handle response and errors
              if (response.ok) {
                // Success alert with export options
                Alert.alert(
                  'Success',
                  `Successfully exported the box \n\n Group Name: ${selectedGroupName} Box Number: ${selectedBoxNumber}`,
                  [
                    {
                      text: 'Okay',
                      style: 'okay',
                    },
                    {
                      text: 'Go to Google Sheets',
                      onPress: () => {
                        // Navigate to the Google Sheets page using React Navigation
                        navigation.dispatch(
                          CommonActions.navigate({
                            name: 'GoogleSheetsPage',
                          })
                        );
                      },
                    },
                  ]
                );
              } else {
                Alert.alert('Error', 'Failed to export the box. Please try again.');
              }
            } catch (error) {
              Alert.alert('Error', 'An error occurred. Please check your connection and try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );    
  };
  

  return (
    <View style={styles.container}>
      {isLoading &&
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      }
      <Text style={styles.title}>Export Box</Text>
      <Text style={styles.paragraph}>Here you can export a box for a specific group to a Google Sheet.</Text>
      <TouchableOpacity style={styles.dropdownContainer} onPress={getGroupNames}>
        <Text style={styles.dropdownText}>{isGroupNameSelected ? selectedGroupName : 'Select Group'}</Text>
        <Icon style={{ position: 'absolute', right: 12 }} name='caret-down' size={22} color='#000000' />
      </TouchableOpacity>
      <TouchableOpacity style={styles.dropdownContainer} onPress={getBoxNumbers}>
        <Text style={styles.dropdownText}>{isBoxNumberSelected ? selectedBoxNumber : 'Select Box'}</Text>
        <Icon style={{ position: 'absolute', right: 12 }} name='caret-down' size={22} color='#000000' />
      </TouchableOpacity>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button]} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Export Box</Text>
        </TouchableOpacity>
      </View>
      <BottomSheet
        ref={groupNamesBottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleGroupSheetChange}
      >
        <View style={styles.bottomSheetTitleContainer}>
          <Text style={styles.dropdownText}>Select Group</Text>
          <TouchableOpacity style={{ position: 'absolute', right: 12 }} onPress={() => handleCloseIconPress(groupNamesBottomSheetRef)}>
            <Icon name="times" size={18} color="black" />
          </TouchableOpacity>
        </View>

        <BottomSheetSectionList
          sections={[{ title: 'Select Group', data: groupNames }]}
          keyExtractor={(item) => item}
          renderItem={renderGroupItem}

          contentContainerStyle={styles.contentContainer}
        />
      </BottomSheet>
      <BottomSheet
        ref={boxNumbersBottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleBoxSheetChange}
      >
        <View style={styles.bottomSheetTitleContainer}>
          <Text style={styles.dropdownText}>Select Box</Text>
          <TouchableOpacity style={{ position: 'absolute', right: 12 }} onPress={() => handleCloseIconPress(boxNumbersBottomSheetRef)}>
            <Icon name="times" size={18} color="black" />
          </TouchableOpacity>
        </View>

        <BottomSheetSectionList
          sections={[{ title: 'Select Box', data: boxNumbers }]}
          keyExtractor={(item) => item}
          renderItem={renderBoxItem}
          contentContainerStyle={styles.contentContainer}
        />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: 'black',
  },
  paragraph: {
    fontSize: 18,
    fontWeight: '300',
    marginBottom: 10,
    textAlign: 'center',
    color: 'black',
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
  },
  dropdownContainer: {
    flexDirection: 'row',
    borderColor: '#ccc',
    borderRadius: 5,
    borderWidth: 1,
    height: 40,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center'
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
  dropdownText: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
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
  buttonsContainer: {
    flex: 0,
    width: '100%',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    marginTop: 10
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

export default AdminExportBoxTab;
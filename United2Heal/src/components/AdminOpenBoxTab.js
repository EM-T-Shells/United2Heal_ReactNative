import React, { useState, useCallback, useRef, useMemo, useEffect} from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import BottomSheet, { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import Divider from './Divider';

const AdminOpenBoxTab = () => {
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
  const [selectBoxTypeShown, setSelectBoxTypeShown] = useState(false);
  const [isExistingBoxSelected, setIsExistingBoxSelected] = useState(false);
  const [isNewBoxSelected, setIsNewBoxSelected] = useState(false);

  const [newBoxNumber, setNewBoxNumber] = useState(0);

  const snapPoints = useMemo(() => ["40%"], []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSelectedGroupName('A'); // Reset selected group name to default
      setIsGroupNameSelected(false); // Reset group selection status
      setSelectBoxTypeShown(false); // Hide box selection options
      setIsExistingBoxSelected(false); // Reset existing box selection status
      setIsNewBoxSelected(false); // Reset new box selection status
      setIsSubmitDisabled(true); // Disable submit button
      setSelectedBoxNumber('1'); // Reset selected box number
      setIsBoxNumberSelected(false); // Reset box number selection status
    });
    // Return the cleanup function
    return unsubscribe;
  }, [navigation]);

const handleExistingBoxButtonClick = () => {
  setSelectedBoxNumber('1'); // Reset selected box number
  setIsBoxNumberSelected(false); // Reset box number selection status
  setIsSubmitDisabled(false); // Enable submit button
  setSelectBoxTypeShown(false); // Hide box selection options
  setIsExistingBoxSelected(true); // Enable existing box selection status
};

const handleCancelClick = () => {
  setSelectedGroupName('A'); // Reset selected group name to default
  setIsGroupNameSelected(false); // Reset group selection status
  setSelectBoxTypeShown(false); // Hide box selection options
  setIsExistingBoxSelected(false); // Reset existing box selection status
  setIsNewBoxSelected(false); // Reset new box selection status
  setIsSubmitDisabled(true); // Disable submit button
  setSelectedBoxNumber('1'); // Reset selected box number
  setIsBoxNumberSelected(false); // Reset box number selection status
};

const handleNewBoxClick = () => {
  getNewBoxNumber();
  setSelectBoxTypeShown(false); // Hide box selection options
  setIsExistingBoxSelected(false); // Reset existing box selection status
  setIsNewBoxSelected(true); // Reset new box selection status
  setIsSubmitDisabled(false); // Enable submit button
};

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
          setSelectBoxTypeShown(true);
          setIsExistingBoxSelected(false);
          setIsNewBoxSelected(false);
          setIsSubmitDisabled(true); // Disable submit button
          setSelectedBoxNumber('1'); // Reset selected box number
          setIsBoxNumberSelected(false); // Reset box number selection status
          closeBottomSheet(groupNamesBottomSheetRef);
        }}>
          <Text style={styles.groupText}>{item}</Text>
        </TouchableOpacity>
        <Divider/>
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
          setIsSubmitDisabled(false);
          closeBottomSheet(boxNumbersBottomSheetRef);
        }}>
          <Text style={styles.groupText}>{item}</Text>
        </TouchableOpacity>
        <Divider/>
      </View>
    ),
    []
  );

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
      const response = await fetch(`https://f0nyewk1dc.execute-api.us-east-1.amazonaws.com/?GroupName=${selectedGroupName}`);
      if (!response.ok) { 
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const boxes = data.map(item => item.BoxNumber);
      setBoxNumbers(boxes);
      openBottomSheet(boxNumbersBottomSheetRef);
    } catch (error) {
      Alert.alert('Error', error.message);  // Show the actual error message
    } finally {
      setIsLoading(false);
    }
  };

  const getNewBoxNumber = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://izcbceoncf.execute-api.us-east-1.amazonaws.com/?GroupName=${selectedGroupName}`);
      if (!response.ok) { 
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('data: ', data);
      setNewBoxNumber('' + data);
    } catch (error) {
      Alert.alert('Error', error.message);  // Show the actual error message
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Check if all fields are filled
    if ((!isBoxNumberSelected && isExistingBoxSelected) || (newBoxNumber.length = 0 && isNewBoxSelected)) {
        Alert.alert('Error', 'Please fill in all fields.');
        return;
    }
    const boxNum = isExistingBoxSelected ? selectedBoxNumber : newBoxNumber;
    // Construct the item details string for the confirmation alert
    const itemDetails = `
Group Name: ${selectedGroupName}

Box Number: ${boxNum}
    `;

    // Construct the API endpoint with the required parameters
    const apiUrl = `https://jokrknaqi6.execute-api.us-east-1.amazonaws.com/?GroupName=${selectedGroupName}&BoxNumber=${boxNum}`;

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
                                `Successfully opened new box \n\n Group Name: ${selectedGroupName} Box Number: ${boxNum} \n\n Volunteers should now see this box as an option when submitting items!`,
                                [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
                            );
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
    <View style={styles.container}>
      {isLoading && 
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      }
      <Text style={styles.title}>Open Box</Text>
      <Text style={styles.paragraph}>Here you can open a new box for a specific group and select the Box Number.</Text>
      <TouchableOpacity style={styles.dropdownContainer} onPress={getGroupNames}>
        <Text style={styles.dropdownText}>{isGroupNameSelected ? selectedGroupName : 'Select Group'}</Text>
        <Icon style={{ position: 'absolute', right: 12}} name='caret-down' size={22} color='#000000'/>
      </TouchableOpacity>
      {selectBoxTypeShown ?
      <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button]} onPress={handleExistingBoxButtonClick}>
              <Text style={styles.buttonText}>Existing Box</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button]} onPress={handleNewBoxClick}>
              <Text style={styles.buttonText}>New Box</Text>
          </TouchableOpacity>
      </View> : null
      }
      {isExistingBoxSelected ? 
      <>
        <Text style={styles.paragraph}>Select a box that you want to re-open.</Text> 
        <TouchableOpacity style={styles.dropdownContainer} onPress={getBoxNumbers}>
          <Text style={styles.dropdownText}>{isBoxNumberSelected ? selectedBoxNumber : 'Select Box'}</Text>
          <Icon style={{ position: 'absolute', right: 12}} name='caret-down' size={22} color='#000000'/>
        </TouchableOpacity>
      </>
      : null}
      {isNewBoxSelected ? 
      <>
        <Text style={styles.paragraph}>Here you can open a new box for a specific group and select the Box Number.</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Box Number"
          value={newBoxNumber}
          onChangeText={setNewBoxNumber}
          keyboardType="numeric"
        />
      </>
      : null}
      {isSubmitDisabled ? null : 
      <>
        <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancelClick}>
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>
      </>
      }
      <BottomSheet
        ref={groupNamesBottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleGroupSheetChange}
      >
        <View style={styles.bottomSheetTitleContainer}>
          <Text style={styles.dropdownText}>Select Group</Text>
          <TouchableOpacity style={{ position: 'absolute', right: 12}} onPress={() => handleCloseIconPress(groupNamesBottomSheetRef)}>
            <Icon  name="times" size={18} color="black" />
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
          <TouchableOpacity style={{ position: 'absolute', right: 12}} onPress={() => handleCloseIconPress(boxNumbersBottomSheetRef)}>
            <Icon  name="times" size={18} color="black" />
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
  textInput: {
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
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: 'black',
  },
  button: {
    width: '45%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 16,
  },
  cancelButton: {
    backgroundColor: '#D3D3D3',
  },
  buttonText: {
    color: 'white',
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  descriptionText: {
    fontStyle: 'italic',
    fontSize: 12,
    color: '#777',
    marginBottom: 5
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

export default AdminOpenBoxTab;
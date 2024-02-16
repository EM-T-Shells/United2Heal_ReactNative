import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, Text, Alert, ActivityIndicator, TouchableOpacity, FlatList} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { getSearchItemsList } from '../../U2HConfigNode';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Divider from './Divider';
import U2HConfigNode from '../../U2HConfigNode';
import Item from '../models/Item';

const SearchTab = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(getSearchItemsList()); 
  const [isLoading, setIsLoading] = useState(false); 
  const [searchItems, setSearchItems] = useState([]);
  const navigation = useNavigation();

  const handleSearch = (text) => {
    setSearchText(text);
    const filteredItems = getSearchItemsList().filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filteredItems);
  };

 const getSearchItems = async () => {
    setIsLoading(true); // Set loading to true when we start the API call
    try {
      const response = await fetch(
        'https://pjg9px1sqf.execute-api.us-east-1.amazonaws.com/getSearchItems'
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Map through the response data and create Item objects
      const itemsData = data.map((item) => new Item(item.ItemID, item.ItemName));

      // Update the searchItems state with the new data
      setSearchItems(itemsData);
      // Set the items and store it in the U2HConfigNode
      U2HConfigNode.setSearchItemsList(itemsData);
    } catch (error) {
      console.log(error.message);
      Alert.alert('Error', error.message); // Show the actual error message
    } finally {
      setIsLoading(false); // Set loading to false when the API call is finished
      setFilteredData(getSearchItemsList());
      setSearchText('');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
        // Logic to execute when the screen is focused
        getSearchItems();  // If this is the function that fetches your data
    });

    // Return the cleanup function
    return unsubscribe;
}, [navigation]);

  const renderItem = ({ item }) => {
    return (
        <View style={{marginTop: 12}}>
        <TouchableOpacity onPress={() => {navigation.navigate('Item Page', {itemName: item.name, itemId: item.id });}}>
          <View style={styles.listItem}>
            <Icon style={{marginRight: 16}} name='first-aid' size={24} color='#000000'/>
            <View style={{width: '90%'}}>
              <Text style={{ fontSize: 16, color: 'black' }} numberOfLines={2}>{item.name}</Text>
              <Text style={{ fontSize: 12, color: 'gray' }}>ItemID: {item.id}</Text>
            </View>
            <Icon style={{marginLeft: 4 }} name='angle-right' size={22} color='#000000'/>
          </View>
        </TouchableOpacity>
        <Divider />
        </View>
    );
  };

  return (
    isLoading ? (  // If loading, display the loading screen
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) :
    <View style={styles.listView}>
      <TextInput
        style={{ padding: 10, borderColor: 'gray', borderWidth: 1, color: 'black'}}
        placeholder="Search..."
        value={searchText}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()} // Use item.id as the key
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listView: {
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  textInput: {
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  listItem: {
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    flex: 1,
  },
  loading: {
    marginTop: 20, 
  },
});

export default SearchTab;
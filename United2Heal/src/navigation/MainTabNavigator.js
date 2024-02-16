// MainTabNavigator.js
import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, TextInput, View, Text, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeTab from '../components/HomeTab';
import SearchTab from '../components/SearchTab';
import SettingsTab from '../components/SettingsTab';
import AddItemTab from '../components/AddItemTab';
import ItemPage from '../screens/ItemPage';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import your desired icon library


const Tab = createBottomTabNavigator();

const MainTabNavigator = ({onLogout}) => {

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home'; 
              color = focused ? "#0096FF" : "#000000";
            } else if (route.name === 'Search') {
              iconName = 'search';
              color = focused ? "#0096FF" : "#000000";
            } else if (route.name === 'Settings') {
              iconName = 'cog';
              color = focused ? "#0096FF" : "#000000";
            } else if (route.name === 'Add Item') {
              iconName = 'plus'; 
              color = focused ? "#0096FF" : "#000000";
            }
          return <Icon name={iconName} size={size} color={color} />;
          },
      })}
  
        options={{ headerShown: false }}
      >
      <Tab.Screen name="Home" component={HomeTab} />
      <Tab.Screen name="Search" component={SearchTab} />
      <Tab.Screen name="Add Item" component={AddItemTab} />
      <Tab.Screen name="Settings">{() => <SettingsTab onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="Item Page" component={ItemPage} options={{ tabBarButton: () => (null) }}/>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center', // Center vertically
      alignItems: 'center', // Center horizontally
    },
    loading: {
      marginTop: 20, 
    },
  });

export default MainTabNavigator;

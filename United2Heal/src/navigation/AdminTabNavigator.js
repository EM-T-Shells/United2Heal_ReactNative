// AdminTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminHomeTab from '../components/AdminHomeTab';
import SettingsTab from '../components/SettingsTab';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Import your desired icon library
import AdminOpenBoxTab from '../components/AdminOpenBoxTab';
import AdminCloseBoxTab from '../components/AdminCloseBoxTab';
import AdminExportBoxTab from '../components/AdminExportBoxTab';

const Tab = createBottomTabNavigator();

const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home'; 
            color = focused ? "#0096FF" : "#000000";
          } else if (route.name === 'Open Box') {
            iconName = 'box-open';
            color = focused ? "#0096FF" : "#000000";
          } else if (route.name === 'Close Box') {
            iconName = 'box';
            color = focused ? "#0096FF" : "#000000";
            //export tab here ---------->
          }  else if (route.name === 'Export Box') {
            iconName = 'share';
            color = focused? "#0096FF" : "#000000";
          } else if (route.name === 'Settings') {
            iconName = 'cog';
            color = focused ? "#0096FF" : "#000000";
          } 
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      options={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={AdminHomeTab} />
      <Tab.Screen name="Open Box" component={AdminOpenBoxTab} />
      <Tab.Screen name="Close Box" component={AdminCloseBoxTab} />
      <Tab.Screen name="Export Box" component={AdminExportBoxTab} />
      <Tab.Screen name="Settings" component={SettingsTab} />
    </Tab.Navigator>
  );
};

export default AdminTabNavigator;

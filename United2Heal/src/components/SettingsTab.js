import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation} from '@react-navigation/native';
import LogoutContext from '../contexts/LogoutContext';

const SettingsTab = () => {
  const navigation = useNavigation();
  const { handleLogout } = useContext(LogoutContext);

  return (
    <View style={styles.container}>
      <Text></Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <Text style={styles.settings_text}>© 2023 United2Heal. All rights reserved.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  button: {
    width: '75%',
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
  settings_text:{
    position: 'absolute',
    fontSize: 16,
    fontWeight: 'bold',
    bottom: 60,
    color: 'black',
  },
});

export default SettingsTab;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NewVolunteerScreen = () => {
  return (
    <View style={styles.container}>
      <Text>This is the new screen.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NewVolunteerScreen;

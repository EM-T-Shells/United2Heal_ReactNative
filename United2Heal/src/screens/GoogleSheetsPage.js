// Import necessary modules
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const GoogleSheetsPage = () => {
  return (
    <View style={styles.container}>
      <WebView source={{ uri: 'https://docs.google.com/spreadsheets/d/1vk9U8D8WY3EvQcqSVFPE9mzg5Wz1XjWd8vh5HsUMva8/edit' }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GoogleSheetsPage;

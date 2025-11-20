import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ExpiryScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          Your app has expired. Please contact the admin to extend the expiry
          date.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageContainer: {
    backgroundColor: '#1a1a1a',
    padding: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#333333',
    maxWidth: '90%',
  },
  message: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
  },
});

export default ExpiryScreen;

import React from 'react';
import {StatusBar, SafeAreaView, StyleSheet} from 'react-native';
import SimpleNavigator from './src/navigation/SimpleNavigator';

function App(): JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <SimpleNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

export default App;

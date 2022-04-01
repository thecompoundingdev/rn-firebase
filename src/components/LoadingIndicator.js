import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { Colors } from '../configs';
import View from './View';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function LoadingIndicator() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.orange} />
    </View>
  );
}

export default LoadingIndicator;

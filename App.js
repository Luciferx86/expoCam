import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Cam from './src/Components/Cam';
import Router from './router';

export default function App() {
  return (
    <Router/>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

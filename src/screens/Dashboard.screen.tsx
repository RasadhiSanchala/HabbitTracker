import React, { useState } from 'react';
import { Text, View, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useHabit } from '../context/HabitContext';

type DashboardNavProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

export default function Dashboard() {
  const navigation = useNavigation<DashboardNavProp>();
  const { habits } = useHabit();
   

  useFocusEffect(
    React.useCallback(() => {
    }, [])
  );

  return (
    
    <View style={styles.container}>
       <FlatList
      data={habits}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.habitBox}>
          <Text style={styles.habitText}>{item.name}</Text>
          <Text style={styles.habitText}>Days: {item.days.join(', ')}</Text>
        </View>
      )}
      ListEmptyComponent={<Text>No habits added yet.</Text>}
    />
      
      <TouchableOpacity style={styles.plusButton} onPress={() => navigation.navigate('AddHabbit')}>
        <Text style={styles.plusButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  habitBox: {
    backgroundColor: '#e0f7fa',
    padding: 16,
    marginBottom: 10,
    borderRadius: 8
  },
  habitText: { fontSize: 16 },
  plusButton: {
    backgroundColor: '#00bcd4',
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 16,
    borderRadius: 50,
  },
  plusButtonText: { color: '#fff', fontSize: 24 }
});

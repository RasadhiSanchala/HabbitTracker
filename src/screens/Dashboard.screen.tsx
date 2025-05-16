import React from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useHabit } from '../context/HabitContext';

type DashboardNavProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

export default function Dashboard() {
  const navigation = useNavigation<DashboardNavProp>();
  const { habits, completedHabits, toggleHabitComplete } = useHabit();

  return (
    <View style={styles.container}>
      <FlatList
  data={habits}
  keyExtractor={(item) => item.id}
  extraData={completedHabits} 
  renderItem={({ item }) => {
    const isCompleted = completedHabits.includes(item.id);
    return (
      <View style={[styles.habitBox, isCompleted && styles.habitBoxCompleted]}>
        <TouchableOpacity
          style={[styles.circle, isCompleted && styles.circleFilled]}
          onPress={() => toggleHabitComplete(item.id)}
        />
        <Text>{item.name}</Text>
        <Text>Days: {item.days.join(', ')}</Text>
      </View>
    );
  }}
/>

      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => navigation.navigate('AddHabbit')}
      >
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
    borderRadius: 8,
    position: 'relative',
  },
  habitBoxCompleted: {
    backgroundColor: '#b2dfdb',
  },
  habitText: { fontSize: 16 },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00796b',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  circleFilled: {
    backgroundColor: '#00796b',
  },
  plusButton: {
    backgroundColor: '#00bcd4',
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 16,
    borderRadius: 50,
  },
  plusButtonText: { color: '#fff', fontSize: 24 },
});

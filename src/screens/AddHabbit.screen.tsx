import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

import { useHabit } from '../context/HabitContext';

type AddHabitNavProp = NativeStackNavigationProp<RootStackParamList, 'AddHabbit'>;

export default function AddHabbit() {
  const navigation = useNavigation<AddHabitNavProp>();
  const [habitName, setHabitName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]); 

  const { addHabit } = useHabit();

const handleSave = () => {
  if (habitName.trim() === '') return;

  addHabit({
    id: Date.now().toString(),
    name: habitName,
    days: selectedDays,
  });

  navigation.navigate('Dashboard');
};


  return (
    <View style={styles.container}>
      <Text style={styles.label}>Habit Name</Text>
      <TextInput
        placeholder="e.g. Drink Water"
        value={habitName}
        onChangeText={setHabitName}
        style={styles.input}
      />

      <View style={styles.row}>
        <Text style={styles.label}>Habit Days</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SelectDays')}>
          <Text style={styles.arrow}>➡️</Text>
        </TouchableOpacity>
      </View>

      <Button title="Save Habit" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    padding: 10, borderRadius: 5, marginBottom: 16
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 20
  },
  arrow: { fontSize: 20 }
});

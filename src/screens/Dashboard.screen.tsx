import React, { useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useHabit } from '../context/HabitContext';

type DashboardNavProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

export default function Dashboard() {
  const navigation = useNavigation<DashboardNavProp>();
  const { habits, completedHabits, toggleHabitComplete, deleteHabit, setEditingHabit } = useHabit();
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Completed'>('All');

  const filteredHabits = habits.filter((habit) => {
    if (activeTab === 'Completed') return completedHabits.includes(habit.id);
    if (activeTab === 'Pending') return !completedHabits.includes(habit.id);
    return true;
  });

  return (
    <View style={styles.container}>

      <View style={styles.tabContainer}>
        {['All', 'Pending', 'Completed'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
            onPress={() => setActiveTab(tab as 'All' | 'Pending' | 'Completed')}
          >
            <Text style={activeTab === tab ? styles.activeTabText : styles.tabText}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredHabits}
        keyExtractor={(item) => item.id}
        extraData={[completedHabits, selectedHabitId, activeTab]}
        renderItem={({ item }) => {
          const isCompleted = completedHabits.includes(item.id);
          const isSelected = selectedHabitId === item.id;

          return (
            <TouchableOpacity
              onPress={() =>
                setSelectedHabitId((prev) => (prev === item.id ? null : item.id))
              }
            >
              <View style={[styles.habitBox, isCompleted && styles.habitBoxCompleted]}>
                <TouchableOpacity
                  style={[styles.circle, isCompleted && styles.circleFilled]}
                  onPress={() => toggleHabitComplete(item.id)}
                />
                <Text>{item.name}</Text>
                <Text>Days: {item.days.join(', ')}</Text>

                {isSelected && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() =>
                        Alert.alert(
                          'Edit Habit',
                          'Do you want to edit this habit?',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: 'OK',
                              onPress: () => {
                                setEditingHabit(item);
                                navigation.navigate('AddHabbit');
                              },
                            },
                          ],
                          { cancelable: true }
                        )
                      }
                    >
                      <Text style={styles.deleteButtonText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() =>
                        Alert.alert(
                          'Delete Habit',
                          'Are you sure you want to delete this habit?',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: 'Delete',
                              style: 'destructive',
                              onPress: () => deleteHabit(item.id),
                            },
                          ]
                        )
                      }
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#cfd8dc',
  },
  activeTabButton: {
    backgroundColor: '#00796b',
  },
  tabText: {
    color: '#333',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },

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
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#e57373',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  editButton: {
    backgroundColor: '#4caf50',
    padding: 6,
    borderRadius: 6,
  },
});

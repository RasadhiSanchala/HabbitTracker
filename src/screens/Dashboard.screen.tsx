import React, { useState } from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useHabit } from '../context/HabitContext';
import moment from 'moment';

type DashboardNavProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

export default function Dashboard() {
  const navigation = useNavigation<DashboardNavProp>();
  const { habits, completedHabits, toggleHabitComplete, deleteHabit, setEditingHabit } = useHabit();
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [selectedDate, setSelectedDate] = useState(moment().format('dddd'));


  const last7Days = Array.from({ length: 7 }, (_, i) =>
    moment().subtract(i, 'days').format('dddd')
  ).reverse();

  const filteredHabits = habits.filter((habit) => {
    const isForDate = habit.days.includes(selectedDate);
    const isCompleted = completedHabits.includes(habit.id);

    if (selectedTab === 'All') return isForDate;
    if (selectedTab === 'Pending') return isForDate && !isCompleted;
    if (selectedTab === 'Completed') return isForDate && isCompleted;
  });

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
        {last7Days.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dateCircle,
              selectedDate === day && styles.dateCircleSelected,
            ]}
            onPress={() => setSelectedDate(day)}
          >
            <Text style={styles.dateText}>{day.substring(0, 3)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>


      <View style={styles.tabContainer}>
        {['All', 'Pending', 'Completed'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              selectedTab === tab && styles.tabSelected,
            ]}
            onPress={() => setSelectedTab(tab as 'All' | 'Pending' | 'Completed')}
          >
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredHabits}
        keyExtractor={(item) => item.id}
        extraData={[completedHabits, selectedHabitId, selectedTab, selectedDate]}
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
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddHabbit')}
      >
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  dateScroll: { marginBottom: 10 },
  dateCircle: {
    backgroundColor: '#ddd',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  dateCircleSelected: {
    backgroundColor: '#00bcd4',
  },
  dateText: {
    color: '#000',
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  tabSelected: {
    backgroundColor: '#00bcd4',
  },
  tabText: {
    color: '#000',
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
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
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
  editButton: {
    backgroundColor: '#4caf50',
    padding: 6,
    borderRadius: 6,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#00bcd4',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

});

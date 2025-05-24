import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useHabit } from '../context/HabitContext';
import {
  getPastDates,
  getPastWeeks,
  getPastMonths,
} from '../utils/DateUtils';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import BottomNavBar from '../components/BottomNavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ViewMode = 'daily' | 'weekly' | 'monthly';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AnalyticsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { habits, completedHabits } = useHabit();
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [selectedIndex, setSelectedIndex] = useState(0); 

  const getLabels = (): string[] => {
    if (viewMode === 'daily') return getPastDates(5).reverse();
    if (viewMode === 'weekly') return getPastWeeks(5).reverse();
    return getPastMonths(5).reverse();
  };

  
  const getDayName = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };


  const getDatesInWeek = (weekStartDate: string): string[] => {
    const dates: string[] = [];
    const startDate = new Date(weekStartDate);
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      dates.push(currentDate.toISOString().split('T')[0]);
    }
    return dates;
  };

  
  const getDatesInMonth = (monthStartDate: string): string[] => {
    const dates: string[] = [];
    const startDate = new Date(monthStartDate);
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  
  const getFilteredHabits = (key: string) => {
    if (viewMode === 'daily') {
      
      const dayName = getDayName(key);
      return habits.filter(habit => habit.days.includes(dayName));
    } else if (viewMode === 'weekly') {
   
      const weekDates = getDatesInWeek(key);
      const weekHabits = new Set<string>();
      
      weekDates.forEach(date => {
        const dayName = getDayName(date);
        habits.forEach(habit => {
          if (habit.days.includes(dayName)) {
            weekHabits.add(habit.id);
          }
        });
      });
      
      return habits.filter(habit => weekHabits.has(habit.id));
    } else {
   
      const monthDates = getDatesInMonth(key);
      const monthHabits = new Set<string>();
      
      monthDates.forEach(date => {
        const dayName = getDayName(date);
        habits.forEach(habit => {
          if (habit.days.includes(dayName)) {
            monthHabits.add(habit.id);
          }
        });
      });
      
      return habits.filter(habit => monthHabits.has(habit.id));
    }
  };

  const getSummary = (key: string) => {
    const filteredHabits = getFilteredHabits(key);
    
    if (viewMode === 'daily') {
    
      const completed = completedHabits[key] || [];
      const completedFilteredHabits = completed.filter(habitId => 
        filteredHabits.some(habit => habit.id === habitId)
      );
      
      const total = filteredHabits.length;
      const completedCount = completedFilteredHabits.length;
      const pending = total - completedCount;

      return {
        total,
        completed: completedCount,
        pending,
        percentage: total ? Math.round((completedCount / total) * 100) : 0,
      };
    } else if (viewMode === 'weekly') {
    
      const weekDates = getDatesInWeek(key);
      let totalExpectedCompletions = 0;
      let actualCompletions = 0;
      
      weekDates.forEach(date => {
        const dayName = getDayName(date);
        const habitsForDay = filteredHabits.filter(habit => habit.days.includes(dayName));
        const completedForDay = completedHabits[date] || [];
        const completedHabitsForDay = completedForDay.filter(habitId => 
          habitsForDay.some(habit => habit.id === habitId)
        );
        
        totalExpectedCompletions += habitsForDay.length;
        actualCompletions += completedHabitsForDay.length;
      });
      
      const pending = totalExpectedCompletions - actualCompletions;
      
      return {
        total: filteredHabits.length,
        completed: actualCompletions,
        pending: pending,
        percentage: totalExpectedCompletions ? Math.round((actualCompletions / totalExpectedCompletions) * 100) : 0,
      };
    } else {
    
      const monthDates = getDatesInMonth(key);
      let totalExpectedCompletions = 0;
      let actualCompletions = 0;
      
      monthDates.forEach(date => {
        const dayName = getDayName(date);
        const habitsForDay = filteredHabits.filter(habit => habit.days.includes(dayName));
        const completedForDay = completedHabits[date] || [];
        const completedHabitsForDay = completedForDay.filter(habitId => 
          habitsForDay.some(habit => habit.id === habitId)
        );
        
        totalExpectedCompletions += habitsForDay.length;
        actualCompletions += completedHabitsForDay.length;
      });
      
      const pending = totalExpectedCompletions - actualCompletions;
      
      return {
        total: filteredHabits.length, 
        completed: actualCompletions,
        pending: pending,
        percentage: totalExpectedCompletions ? Math.round((actualCompletions / totalExpectedCompletions) * 100) : 0,
      };
    }
  };

  const labels = getLabels();
  const selectedLabel = labels[selectedIndex];
  const { total, completed, pending, percentage } = getSummary(selectedLabel);

  const handleHome = () => navigation.navigate('Home');
  const handleDashboard = () => navigation.navigate('Dashboard');
  const handleAdd = () => navigation.navigate('AddHabbit');
  const handleProgress = () => navigation.navigate('Home');

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate('SignIn'); 
    } catch (error) {
      console.error('Failed to clear AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Progress</Text>
      </View>

      <View style={styles.tabRow}>
        {['daily', 'weekly', 'monthly'].map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[
              styles.tab,
              viewMode === mode && styles.activeTab,
            ]}
            onPress={() => {
              setViewMode(mode as ViewMode);
              setSelectedIndex(0); 
            }}
          >
            <Text style={[
              styles.tabText,
              viewMode === mode && styles.activeTabText
            ]}>
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

 
      <View style={styles.chartRow}>
        {labels.map((label, index) => {
          const { percentage } = getSummary(label);
          return (
            <TouchableOpacity
              key={label}
              onPress={() => setSelectedIndex(index)}
              style={[
                styles.chartItem,
                selectedIndex === index && styles.selectedChartItem,
              ]}
            >
              <View style={[styles.bar, { height: `${percentage}%` }]} />
              <Text style={styles.chartLabel}>{label.slice(-5)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>


      <View style={styles.statsBox}>
        <Text style={styles.statsTitle}>Stats for: {selectedLabel}</Text>

        <View style={styles.statsField}>
          <Text style={styles.fieldLabel}>
            {viewMode === 'daily' ? 'Total Habits' : 'Unique Habits'}
          </Text>
          <Text style={styles.fieldValue}>{total}</Text>
        </View>
        <View style={styles.statsField}>
          <Text style={styles.fieldLabel}>Completed</Text>
          <Text style={styles.fieldValue}>{completed}</Text>
        </View>
        <View style={styles.statsField}>
          <Text style={styles.fieldLabel}>Pending</Text>
          <Text style={styles.fieldValue}>{pending}</Text>
        </View>
        <View style={styles.statsField}>
          <Text style={styles.fieldLabel}>Completion</Text>
          <Text style={styles.fieldValue}>{percentage}%</Text>
        </View>
      </View>

   
      <BottomNavBar
        onHome={handleHome}
        onDashboard={handleDashboard}
        onAdd={handleAdd}
        onProgress={handleProgress}
        onLogout={handleLogout}
      />
    </View>
  );
};

const brown = '#6B4F4F';
const lightBrown = '#A97C7C';
const background = '#FBEDE2';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f6f3',
    justifyContent: 'space-between',
  },
  headerContainer: {
    marginTop: 40,
    marginBottom: 10,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: brown,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    marginTop: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: lightBrown,
  },
  activeTab: {
    backgroundColor: brown,
  },
  tabText: {
    color: '#fff',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
    height: 150,
  },
  chartItem: {
    alignItems: 'center',
    width: '18%',
    backgroundColor: '#e5d3d3',
    borderRadius: 10,
    paddingTop: 5,
  },
  selectedChartItem: {
    backgroundColor: brown,
  },
  bar: {
    width: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  chartLabel: {
    fontSize: 12,
    color: '#333',
    marginTop: 5,
  },
  statsBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff0e6',
    elevation: 2,
    marginBottom: 10,
  },
  statsTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 16,
    color: brown,
    textAlign: 'center',
  },
  statsField: {
    backgroundColor: lightBrown,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: brown,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 6,
    fontWeight: '600',
  },
  fieldValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default AnalyticsScreen;
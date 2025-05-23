import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useHabit } from '../context/HabitContext';
import { getPastDates, getPastWeeks, getPastMonths } from '../utils/DateUtils';

const AnalyticsScreen = () => {
  const { habits, completedHabits } = useHabit();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const calculateStats = (dates: string[]) => {
    return dates.map(date => {
      const completed = completedHabits[date] || [];
      const total = habits.length;
      const done = completed.length;
      const pending = total - done;
      const percent = total > 0 ? Math.round((done / total) * 100) : 0;
      return { date, percent, done, pending, total };
    });
  };

  const renderBarChart = (stats: any[]) => {
    return (
      <View style={styles.chartContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.chartBarWrapper}>
            <Text style={styles.chartLabel}>{stat.date}</Text>
            <View style={styles.barBackground}>
              <View style={[styles.barFill, { height: `${stat.percent}%` }]} />
            </View>
            <Text style={styles.percentText}>{stat.percent}%</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderSummary = (stat: any) => (
    <View style={styles.summaryBox}>
      <Text style={styles.summaryText}>Total Habits: {stat.total}</Text>
      <Text style={styles.summaryText}>Completed: {stat.done}</Text>
      <Text style={styles.summaryText}>Pending: {stat.pending}</Text>
    </View>
  );

  const dates =
    activeTab === 'daily'
      ? getPastDates(5)
      : activeTab === 'weekly'
      ? getPastWeeks(5)
      : getPastMonths(5);

  const stats = calculateStats(dates);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.tabContainer}>
        {['daily', 'weekly', 'monthly'].map(type => (
          <TouchableOpacity
            key={type}
            onPress={() => setActiveTab(type as any)}
            style={[
              styles.tabButton,
              activeTab === type && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === type && styles.activeTabText,
              ]}
            >
              {type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {renderBarChart(stats)}
      {stats[0] && renderSummary(stats[0])}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4EDE4', // light brown
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tabButton: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#8B5E3C',
  },
  tabText: {
    fontSize: 16,
    color: '#5C4033',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#8B5E3C',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  chartBarWrapper: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  chartLabel: {
    fontSize: 12,
    marginBottom: 4,
    color: '#6B4F3B',
  },
  barBackground: {
    width: 20,
    height: 100,
    backgroundColor: '#D3C0B0',
    borderRadius: 5,
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#A97142',
    borderRadius: 5,
  },
  percentText: {
    marginTop: 4,
    fontSize: 12,
    color: '#5C4033',
  },
  summaryBox: {
    padding: 15,
    backgroundColor: '#EADAC8',
    borderRadius: 10,
    marginTop: 10,
  },
  summaryText: {
    fontSize: 16,
    color: '#4B3621',
    marginBottom: 5,
  },
});

export default AnalyticsScreen;

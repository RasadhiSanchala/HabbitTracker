import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import moment from 'moment';

type Props = {
  selectedDate: string;
  onDateSelect: (day: string) => void;
};

const Last7DaysSelector: React.FC<Props> = ({ selectedDate, onDateSelect }) => {
  const last7Days = Array.from({ length: 7 }, (_, i) =>
    moment().subtract(i, 'days').format('dddd')
  ).reverse();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
      {last7Days.map((day) => (
        <TouchableOpacity
          key={day}
          style={[
            styles.dateCircle,
            selectedDate === day && styles.dateCircleSelected,
          ]}
          onPress={() => onDateSelect(day)}
        >
          <Text style={styles.dateText}>{day.slice(0, 3)}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    marginBottom: 16,
  },
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
});

export default Last7DaysSelector;

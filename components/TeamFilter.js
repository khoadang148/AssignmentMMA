import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

export default function TeamFilter({ teams, selectedTeam, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{
        marginVertical: 12,
        marginLeft: 8,
        minHeight: 56,
        maxHeight: 72,
        zIndex: 10,
        backgroundColor: '#f4f8fb',
      }}
      contentContainerStyle={{
        alignItems: 'center',
        paddingRight: 24,
        paddingTop: 6,
        paddingBottom: 6,
      }}
    >
      <TouchableOpacity
        style={[styles.chip, !selectedTeam && styles.chipActive]}
        onPress={() => onSelect(null)}
        activeOpacity={0.7}
      >
        <Icon name="soccer" type="material-community" color={!selectedTeam ? '#fff' : '#43a047'} size={18} />
        <Text style={[styles.chipText, !selectedTeam && styles.chipTextActive]}>Tất cả</Text>
      </TouchableOpacity>
      {teams.map(team => (
        <TouchableOpacity
          key={team}
          style={[styles.chip, selectedTeam === team && styles.chipActive]}
          onPress={() => onSelect(selectedTeam === team ? null : team)}
          activeOpacity={0.7}
        >
          <Icon name="tshirt-crew" type="material-community" color={selectedTeam === team ? '#FFD700' : '#43a047'} size={18} />
          <Text style={[styles.chipText, selectedTeam === team && styles.chipTextActive]}>{team}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    borderRadius: 20,
    marginHorizontal: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: '#43a047',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 2,
    borderColor: '#fff',
  },
  chipActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  chipText: {
    color: '#43a047',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 6,
  },
  chipTextActive: {
    color: '#fff',
    textShadowColor: '#43a047',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
}); 
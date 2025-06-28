import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

export default function PlayerCard({ player, isFavorite, onToggleFavorite, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.touch}>
      <View style={styles.card}>
        <View style={styles.avatarWrap}>
          <Image source={{ uri: player.image }} style={styles.avatar} />
          <Icon name="soccer" type="material-community" color="#FFD700" size={22} containerStyle={styles.soccerIcon} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{player.playerName}</Text>
          <Text style={styles.label}>Đội: <Text style={styles.value}>{player.team}</Text></Text>
          <Text style={styles.label}>Vị trí: <Text style={styles.value}>{player.position} {player.isCaptain ? <Text style={styles.captain}>(Đội trưởng)</Text> : ''}</Text></Text>
          <Text style={styles.label}>Thời gian thi đấu: <Text style={styles.value}>{Math.floor(player.MinutesPlayed/60)}h {player.MinutesPlayed%60}m</Text></Text>
          <Text style={styles.label}>Độ chính xác: <Text style={styles.value}>{(player.PassingAccuracy*100).toFixed(0)}%</Text></Text>
        </View>
        <TouchableOpacity onPress={onToggleFavorite} style={styles.starBtn} activeOpacity={0.7}>
          <Icon
            name={isFavorite ? 'heart' : 'heart-outline'}
            type="material-community"
            color={isFavorite ? '#e53935' : '#bbb'}
            size={24}
            containerStyle={isFavorite ? styles.starActive : styles.starInactive}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touch: { marginBottom: 18 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#43a047',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    marginHorizontal: 8,
  },
  avatarWrap: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#FFD700',
    backgroundColor: '#f0f0f0',
  },
  soccerIcon: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
    elevation: 2,
  },
  info: { flex: 1 },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: '#43a047',
    marginTop: 2,
    fontWeight: 'bold',
  },
  value: {
    color: '#222',
    fontWeight: '500',
  },
  starBtn: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 20,
  },
  starActive: {
    backgroundColor: '#fffbe6',
    borderRadius: 20,
  },
  starInactive: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  captain: {
    color: '#FFD700',
    fontWeight: 'bold',
    marginLeft: 2,
  },
}); 
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput } from 'react-native';
import { fetchPlayers } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import PlayerCard from '../components/PlayerCard';
import { Icon } from 'react-native-elements';
import TeamFilter from '../components/TeamFilter';

export default function HomeScreen() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [search, setSearch] = useState('');
  const [avatars, setAvatars] = useState({});
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchPlayers().then(data => {
      setPlayers(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    // Load lại avatar mỗi khi quay lại màn hình Home
    loadAvatars();
  }, [players, isFocused]);

  useEffect(() => {
    // Load lại danh sách yêu thích mỗi khi quay lại Home
    loadFavorites();
  }, [isFocused]);

  async function loadFavorites() {
    const favs = await AsyncStorage.getItem('favorites');
    setFavoriteIds(favs ? JSON.parse(favs) : []);
  }

  async function loadAvatars() {
    const avatarMap = {};
    for (const p of players) {
      const uri = await AsyncStorage.getItem(`player_avatar_${p.id}`);
      if (uri) avatarMap[p.id] = uri;
    }
    setAvatars(avatarMap);
  }

  async function toggleFavorite(id) {
    let newFavs;
    if (favoriteIds.includes(id)) {
      newFavs = favoriteIds.filter(favId => favId !== id);
    } else {
      newFavs = [...favoriteIds, id];
    }
    setFavoriteIds(newFavs);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavs));
  }

  const teams = Array.from(new Set(players.map(p => p.team)));
  const filteredPlayers = players.filter(p =>
    (!selectedTeam || p.team === selectedTeam) &&
    p.playerName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#43a047" /><Text style={{color:'#43a047'}}>Đang tải dữ liệu...</Text></View>;

  return (
    <View style={{ flex: 1, backgroundColor: '#e8f5e9' }}>
      <View style={styles.headerRow}>
        <Icon name="soccer" type="material-community" color="#43a047" size={28} style={{marginRight:8}} />
        <Text style={styles.header}>Danh sách cầu thủ</Text>
      </View>
      <Text style={styles.label}>Tìm kiếm cầu thủ:</Text>
      <View style={styles.searchRow}>
        <Icon name="magnify" type="material-community" color="#43a047" size={22} style={{marginLeft:8}} />
        <TextInput
          style={styles.input}
          placeholder="Nhập tên cầu thủ..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#aaa"
        />
      </View>
      <Text style={styles.label}>Chọn đội bóng:</Text>
      <TeamFilter teams={teams} selectedTeam={selectedTeam} onSelect={setSelectedTeam} />
      <FlatList
        data={filteredPlayers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <PlayerCard
            player={{ ...item, image: avatars[item.id] || item.image }}
            isFavorite={favoriteIds.includes(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
            onPress={() => navigation.navigate('Detail', { player: item })}
          />
        )}
        ListEmptyComponent={<View style={styles.center}><Text>Không tìm thấy cầu thủ nào.</Text></View>}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 8,
    marginLeft: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#43a047',
  },
  input: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#fff',
    fontSize: 15,
    color: '#222',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 12,
    marginBottom: 8,
    paddingHorizontal: 8,
    shadowColor: '#43a047',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: {
    fontWeight: 'bold',
    color: '#43a047',
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 2,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 
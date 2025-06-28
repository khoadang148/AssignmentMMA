import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchPlayers } from '../utils/api';
import { Icon } from 'react-native-elements';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import PlayerCard from '../components/PlayerCard';

export default function FavoritesScreen() {
  const [players, setPlayers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');
  const [avatars, setAvatars] = useState({});
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    loadData();
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    loadAvatars();
  }, [players, favorites, isFocused]);

  async function loadData() {
    const allPlayers = await fetchPlayers();
    const favIds = JSON.parse(await AsyncStorage.getItem('favorites') || '[]');
    setPlayers(allPlayers);
    setFavorites(favIds);
  }

  async function loadAvatars() {
    const avatarMap = {};
    for (const p of players) {
      const uri = await AsyncStorage.getItem(`player_avatar_${p.id}`);
      if (uri) avatarMap[p.id] = uri;
    }
    setAvatars(avatarMap);
  }

  async function removeFavorite(id) {
    const player = players.find(p => p.id === id);
    Alert.alert(
      'Xác nhận',
      `Bạn có chắc muốn xóa cầu thủ "${player?.playerName || ''}" khỏi danh sách yêu thích?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: async () => {
            const newFavs = favorites.filter(favId => favId !== id);
            setFavorites(newFavs);
            await AsyncStorage.setItem('favorites', JSON.stringify(newFavs));
          }
        }
      ]
    );
  }

  async function removeAllFavorites() {
    if (favorites.length === 0) {
      Alert.alert('Thông báo', 'Không có mục nào để xóa.');
      return;
    }
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa tất cả cầu thủ yêu thích?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa tất cả', style: 'destructive', onPress: async () => {
        setFavorites([]);
        await AsyncStorage.setItem('favorites', JSON.stringify([]));
      }}
    ]);
  }

  const favPlayers = players.filter(p => favorites.includes(p.id) && p.playerName.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f6fa' }}>
      <Text style={[styles.label, { fontSize: 16, marginBottom: 15, marginTop: 20}]}>Tìm kiếm cầu thủ yêu thích</Text>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm cầu thủ..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#aaa"
        />
        <Icon name="delete" type="material-community" color="#e53935" size={26} onPress={removeAllFavorites} containerStyle={{ marginLeft: 8 }} />
      </View>
      {favPlayers.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="heart-outline" type="material-community" color="#e53935" size={70} style={{marginBottom:14}} />
          <Text style={styles.emptyText}>Chưa có cầu thủ yêu thích nào.</Text>
        </View>
      ) : (
        <FlatList
          data={favPlayers}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PlayerCard
              player={{ ...item, image: avatars[item.id] || item.image }}
              isFavorite={true}
              onToggleFavorite={() => removeFavorite(item.id)}
              onPress={() => navigation.navigate('Detail', { player: item })}
            />
          )}
          contentContainerStyle={{ paddingBottom: 28, paddingHorizontal: 12, paddingTop: 4 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
    marginLeft: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#43a047',
    letterSpacing: 0.5,
  },
  input: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    fontSize: 15,
    color: '#222',
    shadowColor: '#43a047',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 12,
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
    marginLeft: 20,
    marginTop: 8,
    marginBottom: 2,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 2,
  },
}); 
import React, { useLayoutEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon, Card } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

function groupFeedbacks(feedbacks) {
  const groups = {};
  feedbacks.forEach(fb => {
    if (!groups[fb.rating]) groups[fb.rating] = [];
    groups[fb.rating].push(fb);
  });
  return groups;
}

function CustomHeader({ title, onBack }) {
  return (
    <View style={styles.headerCustom}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Icon name="arrow-left" type="material-community" color="#fff" size={24} />
      </TouchableOpacity>
      <Icon name="soccer" type="material-community" color="#A5D6A7" size={22} style={{marginLeft:6, marginRight:2}} />
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
}

export default function DetailScreen({ route, navigation }) {
  const { player } = route.params;
  const [favorite, setFavorite] = useState(false);
  const [localImage, setLocalImage] = useState(null);
  const [selectedStar, setSelectedStar] = useState('all');

  // Load ảnh từ AsyncStorage khi vào màn hình
  const loadAvatar = useCallback(async () => {
    const uri = await AsyncStorage.getItem(`player_avatar_${player.id}`);
    if (uri) setLocalImage(uri);
  }, [player.id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <CustomHeader title="Chi tiết cầu thủ" onBack={() => navigation.goBack()} />,
    });
    AsyncStorage.getItem('favorites').then(favs => {
      const favIds = favs ? JSON.parse(favs) : [];
      setFavorite(favIds.includes(player.id));
    });
    loadAvatar();
  }, [player.id, loadAvatar, navigation]);

  async function toggleFavorite() {
    const favs = await AsyncStorage.getItem('favorites');
    let favIds = favs ? JSON.parse(favs) : [];
    if (favIds.includes(player.id)) {
      favIds = favIds.filter(id => id !== player.id);
    } else {
      favIds.push(player.id);
    }
    await AsyncStorage.setItem('favorites', JSON.stringify(favIds));
    setFavorite(favIds.includes(player.id));
  }

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Thông báo', 'Bạn cần cấp quyền truy cập thư viện ảnh để chọn ảnh.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setLocalImage(result.assets[0].uri);
      await AsyncStorage.setItem(`player_avatar_${player.id}`, result.assets[0].uri);
    }
  }

  const grouped = groupFeedbacks(player.feedbacks || []);
  const feedbackKeys = Object.keys(grouped).sort((a, b) => b - a);
  const filteredKeys = selectedStar === 'all' ? feedbackKeys : feedbackKeys.filter(k => k === selectedStar.toString());

  // Tính tổng số feedback cho từng loại sao
  const starCounts = { all: 0 };
  feedbackKeys.forEach(k => {
    starCounts[k] = grouped[k].length;
    starCounts.all += grouped[k].length;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={styles.avatarContainer}>
          <Image source={{ uri: localImage || player.image }} style={styles.avatar} />
          <View style={styles.cameraIcon}>
            <Icon name="camera" type="material-community" color="#fff" size={14} />
          </View>
        </TouchableOpacity>
        <Text style={styles.avatarHint}>Chạm để thay đổi ảnh</Text>
      </View>

      {/* Player Info */}
      <View style={styles.infoCard}>
        <View style={styles.nameRow}>
          <Text style={styles.playerName}>{player.playerName}</Text>
          <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteBtn}>
            <Icon 
              name={favorite ? 'heart' : 'heart-outline'} 
              type='material-community' 
              color={favorite ? '#E53935' : '#BDBDBD'} 
              size={22} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoList}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Đội:</Text>
            <Text style={styles.infoValue}>{player.team}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Vị trí:</Text>
            <Text style={styles.infoValue}>
              {player.position} {player.isCaptain ? '(C)' : ''}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Thời gian:</Text>
            <Text style={styles.infoValue}>
              {Math.floor(player.MinutesPlayed/60)}h {player.MinutesPlayed%60}m
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Độ chính xác:</Text>
            <Text style={styles.infoValue}>
              {(player.PassingAccuracy*100).toFixed(0)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Feedback Section */}
      <View style={styles.feedbackSection}>
        <Text style={styles.sectionTitle}>Đánh giá & Bình luận</Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterContainer}
        >
          <TouchableOpacity 
            style={[styles.filterBtn, selectedStar === 'all' && styles.filterBtnActive]} 
            onPress={() => setSelectedStar('all')} 
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, selectedStar === 'all' && styles.filterTextActive]}>
              Tất cả ({starCounts.all})
            </Text>
          </TouchableOpacity>
          
          {[5,4,3,2,1].map(star => (
            <TouchableOpacity 
              key={star} 
              style={[styles.filterBtn, selectedStar === star && styles.filterBtnActive]} 
              onPress={() => setSelectedStar(star)} 
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, selectedStar === star && styles.filterTextActive]}>
                {star} sao ({starCounts[star] || 0})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filteredKeys.length === 0 ? (
          <Text style={styles.emptyText}>Chưa có đánh giá nào</Text>
        ) : (
          filteredKeys.map(key => (
            <View key={key} style={styles.feedbackCard}>
              <View style={styles.feedbackHeader}>
                <View style={styles.starGroup}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Icon 
                      key={i} 
                      name="star" 
                      type="material-community" 
                      color={i < parseInt(key) ? "#FFD700" : "#E0E0E0"} 
                      size={15} 
                    />
                  ))}
                </View>
                
              </View>
              
              {grouped[key].map((fb, idx) => (
                <View key={idx} style={styles.feedbackItem}>
                  <Text style={styles.feedbackComment}>"{fb.comment}"</Text>
                  <Text style={styles.feedbackAuthor}>
                    — {fb.author} • {new Date(fb.date).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
              ))}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAF7',
  },
  contentContainer: {
    padding: 14,
    paddingBottom: 28,
  },
  headerCustom: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingTop: 36,
    paddingBottom: 10,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  backBtn: {
    padding: 4,
    borderRadius: 14,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 6,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: '#f0f0f0',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 2,
  },
  avatarHint: {
    color: '#4CAF50',
    fontSize: 11,
    marginTop: 2,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#4CAF50',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  playerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
  },
  favoriteBtn: {
    padding: 4,
    borderRadius: 16,
    backgroundColor: '#FFF5F5',
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  infoLabel: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    width: 100,
  },
  infoValue: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 8,
  },
  feedbackSection: {
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#388E3C',
    marginBottom: 10,
    marginLeft: 2,
  },
  filterContainer: {
    marginBottom: 10,
    marginLeft: 2,
  },
  filterBtn: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 3,
  },
  filterBtnActive: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#388E3C',
  },
  filterTextActive: {
    color: '#fff',
  },
  emptyText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 16,
  },
  feedbackCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#4CAF50',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  starGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedbackItem: {
    marginBottom: 6,
  },
  feedbackComment: {
    fontSize: 14,
    color: '#222',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  feedbackAuthor: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    fontStyle: 'italic',
  },
}); 
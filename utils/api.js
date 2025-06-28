import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL || 'https://67dea9b2471aaaa742853795.mockapi.io/SE173532';

export async function fetchPlayers() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu cầu thủ:', error);
    return [];
  }
} 
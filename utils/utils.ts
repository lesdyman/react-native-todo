import AsyncStorage from '@react-native-async-storage/async-storage';

export function generateRandomKey() {
  const digits = '0123456789';
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';

  for (let i = 0; i < 3; i++) {
    result += digits.charAt(Math.floor(Math.random() * digits.length));
  }

  for (let i = 0; i < 2; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  return result;
}

export const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const loadDataFromStorage = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(`Error loading data with key: ${key}`, e);
    return null;
  }
};

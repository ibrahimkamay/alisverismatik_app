import React from 'react';
import { View, Text, TouchableOpacity, Alert, ActionSheetIOS, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../contexts/AuthContext';

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation();

  const handleAvatarPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['İptal', 'Fotoğraf Çek', 'Galeriden Seç'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            Alert.alert('Bilgi', 'Kamera özelliği yakında eklenecek');
          } else if (buttonIndex === 2) {
            Alert.alert('Bilgi', 'Galeri seçme özelliği yakında eklenecek');
          }
        },
      );
    } else {
      Alert.alert(
        'Profil Fotoğrafı',
        'Profil fotoğrafınızı nasıl değiştirmek istiyorsunuz?',
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Fotoğraf Çek', onPress: () => Alert.alert('Bilgi', 'Kamera özelliği yakında eklenecek') },
          { text: 'Galeriden Seç', onPress: () => Alert.alert('Bilgi', 'Galeri seçme özelliği yakında eklenecek') }
        ]
      );
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Çıkış Yap', 
          style: 'destructive',
          onPress: () => signOut()
        }
      ]
    );
  };

  const profileItems = [
    { 
      id: 1, 
      title: 'Hesap Bilgileri', 
      icon: 'person-outline', 
      onPress: () => (navigation as any).navigate('AccountSettings'),
      enabled: true
    },
    { 
      id: 2, 
      title: 'Bildirimler', 
      icon: 'notifications-outline', 
      onPress: () => {},
      enabled: false
    },
    { 
      id: 3, 
      title: 'Gizlilik', 
      icon: 'shield-outline', 
      onPress: () => {},
      enabled: false
    },
    { 
      id: 4, 
      title: 'Yardım', 
      icon: 'help-circle-outline', 
      onPress: () => {},
      enabled: false
    },
    { 
      id: 5, 
      title: 'Hakkında', 
      icon: 'information-circle-outline', 
      onPress: () => {},
      enabled: false
    },
  ];

  const renderProfileItem = (item: typeof profileItems[0]) => (
    <TouchableOpacity
      key={item.id}
      className={`bg-card p-4 rounded-xl shadow-sm mb-3 mx-4 ${!item.enabled ? 'opacity-50' : ''}`}
      onPress={item.enabled ? item.onPress : undefined}
      disabled={!item.enabled}
      activeOpacity={item.enabled ? 0.7 : 1}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${item.enabled ? 'bg-gray-100' : 'bg-gray-50'}`}>
            <Ionicons 
              name={item.icon as any} 
              size={20} 
              color={item.enabled ? "#6B7280" : "#D1D5DB"} 
            />
          </View>
          <View className="flex-1 flex-row items-center justify-between">
            <Text className={`text-base font-medium ${item.enabled ? 'text-textPrimary' : 'text-gray-400'}`}>
              {item.title}
            </Text>
            {!item.enabled && (
              <Text className="text-xs text-gray-400 mr-2">Yakında</Text>
            )}
          </View>
        </View>
        <Ionicons 
          name="chevron-forward" 
          size={16} 
          color={item.enabled ? "#9CA3AF" : "#D1D5DB"} 
        />
      </View>
    </TouchableOpacity>
  );

  const getInitials = () => {
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name.charAt(0)}${user.user_metadata.last_name.charAt(0)}`.toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 py-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-textPrimary">Profil</Text>
      </View>

      <View className="p-4">
        <View className="bg-card p-6 rounded-xl shadow-sm">
          <View className="items-center">
            <TouchableOpacity 
              className="relative mb-4"
              onPress={handleAvatarPress}
              activeOpacity={0.7}
            >
              <View className="w-20 h-20 bg-primary rounded-full items-center justify-center">
                <Text className="text-white font-bold text-2xl">
                  {getInitials()}
                </Text>
              </View>
              <View className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full items-center justify-center border-2 border-primary">
                <Ionicons name="camera" size={14} color="#2b703b" />
              </View>
            </TouchableOpacity>
            <Text className="text-xl font-bold text-textPrimary mb-1">
              {user?.user_metadata?.first_name && user?.user_metadata?.last_name 
                ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                : 'Kullanıcı'
              }
            </Text>
            <Text className="text-base text-textSecondary">{user?.email}</Text>
          </View>
        </View>
      </View>

      <View className="flex-1">
        {profileItems.map(renderProfileItem)}
      </View>

      <View className="p-4">
        <TouchableOpacity
          className="bg-red-50 border border-red-200 p-4 rounded-xl"
          onPress={handleLogout}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            <Text className="text-red-600 font-medium text-base ml-2">Çıkış Yap</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View className="items-center pb-4">
        <Text className="text-textSecondary text-sm">Alışverişmatik v1.0.0</Text>
      </View>
    </SafeAreaView>
  );
} 
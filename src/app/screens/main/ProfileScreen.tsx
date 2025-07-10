import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../contexts/AuthContext';

export function ProfileScreen() {
  const { user, signOut } = useAuth();

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
    { id: 1, title: 'Hesap Bilgileri', icon: 'person-outline', onPress: () => {} },
    { id: 2, title: 'Bildirimler', icon: 'notifications-outline', onPress: () => {} },
    { id: 3, title: 'Gizlilik', icon: 'shield-outline', onPress: () => {} },
    { id: 4, title: 'Yardım', icon: 'help-circle-outline', onPress: () => {} },
    { id: 5, title: 'Hakkında', icon: 'information-circle-outline', onPress: () => {} },
  ];

  const renderProfileItem = (item: typeof profileItems[0]) => (
    <TouchableOpacity
      key={item.id}
      className="bg-card p-4 rounded-xl shadow-sm mb-3 mx-4"
      onPress={item.onPress}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
            <Ionicons name={item.icon as any} size={20} color="#6B7280" />
          </View>
          <Text className="text-base font-medium text-textPrimary">{item.title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">

      <View className="px-4 py-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-textPrimary">Profil</Text>
      </View>


      <View className="p-4">
        <View className="bg-card p-6 rounded-xl shadow-sm">
          <View className="items-center">
            <View className="w-20 h-20 bg-primary rounded-full items-center justify-center mb-4">
              <Text className="text-white font-bold text-2xl">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
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
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';

export function AccountSettingsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  
  const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || '');
  const [lastName, setLastName] = useState(user?.user_metadata?.last_name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Hata', 'Ad ve soyad alanları boş bırakılamaz');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim()
        }
      });

      if (error) throw error;

      Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi');
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Profil güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Hata', 'Tüm şifre alanlarını doldurun');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Yeni şifreler eşleşmiyor');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Hata', 'Yeni şifre en az 6 karakter olmalıdır');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      Alert.alert('Başarılı', 'Şifreniz başarıyla değiştirildi');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Şifre değiştirilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2b703b" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-textPrimary">Hesap Bilgileri</Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 space-y-6">
          
          <View className="bg-white rounded-xl p-6 shadow-sm">
            <Text className="text-lg font-semibold text-textPrimary mb-4">Kişisel Bilgiler</Text>
            
            <View className="space-y-4">
              <View>
                <Text className="text-base font-medium text-textPrimary mb-2">E-posta</Text>
                <View className="bg-gray-100 border border-gray-300 text-textPrimary text-base rounded-lg p-3">
                  <Text className="text-textSecondary">{user?.email}</Text>
                </View>
                <Text className="text-sm text-textSecondary mt-1">E-posta adresi değiştirilemez</Text>
              </View>

              <View>
                <Text className="text-base font-medium text-textPrimary mb-2">Ad</Text>
                <TextInput
                  className="bg-inputBg border border-gray-300 text-textPrimary text-base rounded-lg p-3"
                  style={{ minHeight: 48, paddingVertical: 12 }}
                  placeholder="Adınızı girin"
                  placeholderTextColor="#9CA3AF"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
              </View>

              <View>
                <Text className="text-base font-medium text-textPrimary mb-2">Soyad</Text>
                <TextInput
                  className="bg-inputBg border border-gray-300 text-textPrimary text-base rounded-lg p-3"
                  style={{ minHeight: 48, paddingVertical: 12 }}
                  placeholder="Soyadınızı girin"
                  placeholderTextColor="#9CA3AF"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
              </View>

              <TouchableOpacity
                className={`${loading ? 'bg-gray-400' : 'bg-primary'} py-3 px-6 rounded-lg mt-4`}
                onPress={handleUpdateProfile}
                disabled={loading}
              >
                <Text className="text-white font-semibold text-center">
                  {loading ? 'Güncelleniyor...' : 'Profili Güncelle'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="bg-white rounded-xl p-6 shadow-sm">
            <Text className="text-lg font-semibold text-textPrimary mb-4">Şifre Değiştir</Text>
            
            <View className="space-y-4">
              <View>
                <Text className="text-base font-medium text-textPrimary mb-2">Mevcut Şifre</Text>
                <TextInput
                  className="bg-inputBg border border-gray-300 text-textPrimary text-base rounded-lg p-3"
                  style={{ minHeight: 48, paddingVertical: 12 }}
                  placeholder="Mevcut şifrenizi girin"
                  placeholderTextColor="#9CA3AF"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <View>
                <Text className="text-base font-medium text-textPrimary mb-2">Yeni Şifre</Text>
                <TextInput
                  className="bg-inputBg border border-gray-300 text-textPrimary text-base rounded-lg p-3"
                  style={{ minHeight: 48, paddingVertical: 12 }}
                  placeholder="Yeni şifrenizi girin"
                  placeholderTextColor="#9CA3AF"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <View>
                <Text className="text-base font-medium text-textPrimary mb-2">Yeni Şifre (Tekrar)</Text>
                <TextInput
                  className="bg-inputBg border border-gray-300 text-textPrimary text-base rounded-lg p-3"
                  style={{ minHeight: 48, paddingVertical: 12 }}
                  placeholder="Yeni şifrenizi tekrar girin"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                className={`${loading ? 'bg-gray-400' : 'bg-red-600'} py-3 px-6 rounded-lg mt-4`}
                onPress={handleChangePassword}
                disabled={loading}
              >
                <Text className="text-white font-semibold text-center">
                  {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 
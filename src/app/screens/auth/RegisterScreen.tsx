import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

export function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, firstName, lastName);
      Alert.alert('Başarılı', 'Hesabınız oluşturuldu! Hoş geldiniz!');
  
    } catch (error: any) {
      Alert.alert('Kayıt Hatası', error.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex-1 justify-center px-6 py-8">
  
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-primary rounded-full items-center justify-center mb-4">
                <Ionicons name="basket" size={40} color="white" />
              </View>
              <Text className="text-2xl font-bold text-textPrimary">Hesap Oluştur</Text>
              <Text className="text-base text-textSecondary mt-2">Alışverişmatik'e hoş geldiniz</Text>
            </View>

  
            <View className="space-y-4">
              <View>
                <Text className="text-base font-medium text-textPrimary mb-2">Ad</Text>
                <TextInput
                  className="bg-inputBg border border-gray-300 text-textPrimary text-base rounded-lg p-3 w-full focus:border-primary focus:ring-1 focus:ring-primary"
                  style={{ minHeight: 48, paddingVertical: 12 }}
                  placeholder="Adınızı girin"
                  placeholderTextColor="#9CA3AF"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              <View>
                <Text className="text-base font-medium text-textPrimary mb-2">Soyad</Text>
                <TextInput
                  className="bg-inputBg border border-gray-300 text-textPrimary text-base rounded-lg p-3 w-full focus:border-primary focus:ring-1 focus:ring-primary"
                  style={{ minHeight: 48, paddingVertical: 12 }}
                  placeholder="Soyadınızı girin"
                  placeholderTextColor="#9CA3AF"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              <View>
                <Text className="text-base font-medium text-textPrimary mb-2">E-posta</Text>
                <TextInput
                  className="bg-inputBg border border-gray-300 text-textPrimary text-base rounded-lg p-3 w-full focus:border-primary focus:ring-1 focus:ring-primary"
                  style={{ minHeight: 48, paddingVertical: 12 }}
                  placeholder="E-posta adresinizi girin"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View>
                <Text className="text-base font-medium text-textPrimary mb-2">Şifre</Text>
                <TextInput
                  className="bg-inputBg border border-gray-300 text-textPrimary text-base rounded-lg p-3 w-full focus:border-primary focus:ring-1 focus:ring-primary"
                  style={{ minHeight: 48, paddingVertical: 12 }}
                  placeholder="Şifrenizi girin (en az 6 karakter)"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <TouchableOpacity
                className={`${loading ? 'bg-gray-400' : 'bg-primary active:bg-primary-dark'} text-white font-bold py-4 px-6 rounded-lg mt-8`}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text className="text-white font-bold text-base text-center">
                  {loading ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol'}
                </Text>
              </TouchableOpacity>
            </View>

  
            <View className="flex-row justify-center mt-8">
              <Text className="text-base text-textSecondary">Zaten hesabınız var mı? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text className="text-base text-primary font-medium">Giriş Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 
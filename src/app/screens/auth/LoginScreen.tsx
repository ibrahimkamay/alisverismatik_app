import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert('Giriş Hatası', error.message || 'Bir hata oluştu');
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
        <View className="flex-1 justify-center px-6">
    
          <View className="items-center mb-12">
            <View className="w-20 h-20 bg-primary rounded-full items-center justify-center mb-4">
              <Ionicons name="basket" size={40} color="white" />
            </View>
            <Text className="text-2xl font-bold text-textPrimary">Alışverişmatik</Text>
            <Text className="text-base text-textSecondary mt-2">Akıllı alışveriş listeleri</Text>
          </View>

    
          <View className="space-y-4">
            <View>
              <Text className="text-base font-medium text-textPrimary mb-2">E-posta</Text>
              <TextInput
                className="bg-inputBg border border-gray-300 text-textPrimary text-base rounded-lg p-3 w-full focus:border-primary focus:ring-1 focus:ring-primary"
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
                placeholder="Şifrenizi girin"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              className={`${loading ? 'bg-gray-400' : 'bg-primary active:bg-primary-dark'} text-white font-bold py-3 px-6 rounded-lg mt-6`}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text className="text-white font-bold text-base text-center">
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Text>
            </TouchableOpacity>
          </View>


          <View className="flex-row justify-center mt-8">
            <Text className="text-base text-textSecondary">Hesabınız yok mu? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-base text-primary font-medium">Kayıt Ol</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 
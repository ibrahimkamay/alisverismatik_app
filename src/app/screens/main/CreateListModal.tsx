import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../contexts/AuthContext';
import { useLists } from '../../../hooks/useLists';

export function CreateListModal() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [listTitle, setListTitle] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const { user } = useAuth();
  const { createList } = useLists(user?.id || null);

  const handleCreateList = async () => {
    if (!listTitle.trim()) {
      Alert.alert('Hata', 'Lütfen liste adını girin');
      return;
    }

    if (!user) {
      Alert.alert('Hata', 'Kullanıcı oturumu bulunamadı');
      return;
    }

    setLoading(true);
    try {
      await createList({
        title: listTitle.trim(),
        description: listDescription.trim() || null
      });
      

      setListTitle('');
      setListDescription('');
      setIsModalVisible(false);
      

      navigation.navigate('Lists' as never);
      

      setTimeout(() => {
        Alert.alert('Başarılı', 'Liste başarıyla oluşturuldu!');
      }, 100);
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Liste oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };


  const renderMainScreen = () => (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center">
        <TouchableOpacity
          className="w-16 h-16 bg-primary rounded-full items-center justify-center shadow-lg"
          onPress={() => setIsModalVisible(true)}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
        <Text className="text-base text-textSecondary mt-4">Yeni Liste Oluştur</Text>
      </View>
    </SafeAreaView>
  );


  const renderModal = () => (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setIsModalVisible(false)}
    >
      <SafeAreaView className="flex-1 bg-background">

        <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
          <TouchableOpacity onPress={() => setIsModalVisible(false)}>
            <Text className="text-base text-primary font-medium">İptal</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-textPrimary">Yeni Liste</Text>
          <TouchableOpacity
            onPress={handleCreateList}
            disabled={loading || !listTitle.trim()}
          >
            <Text className={`text-base font-medium ${
              loading || !listTitle.trim() ? 'text-gray-400' : 'text-primary'
            }`}>
              {loading ? 'Oluşturuluyor...' : 'Oluştur'}
            </Text>
          </TouchableOpacity>
        </View>


        <View className="flex-1 p-4">
          <View className="space-y-6">

            <View className="items-center py-8">
              <View className="w-24 h-24 bg-primary-light rounded-full items-center justify-center mb-4">
                <Ionicons name="basket" size={48} color="white" />
              </View>
            </View>


            <View>
              <Text className="text-base font-medium text-textPrimary mb-2">Liste Adı</Text>
              <TextInput
                className="bg-inputBg border border-gray-300 text-textPrimary text-base rounded-lg p-3 w-full focus:border-primary"
                style={{ minHeight: 48, paddingVertical: 12 }}
                placeholder="Örn: Market Alışverişi"
                placeholderTextColor="#9CA3AF"
                value={listTitle}
                onChangeText={setListTitle}
                autoFocus
                maxLength={50}
              />
              <Text className="text-sm text-textSecondary mt-1">
                {listTitle.length}/50 karakter
              </Text>
            </View>


            <View>
              <Text className="text-base font-medium text-textPrimary mb-2">
                Açıklama (isteğe bağlı)
              </Text>
              <TextInput
                className="bg-inputBg border border-gray-300 text-textPrimary text-base rounded-lg p-3 w-full focus:border-primary"
                style={{ minHeight: 48, paddingVertical: 12 }}
                placeholder="Bu liste hakkında kısa bir açıklama..."
                placeholderTextColor="#9CA3AF"
                value={listDescription}
                onChangeText={setListDescription}
                multiline
                numberOfLines={3}
                maxLength={200}
                textAlignVertical="top"
              />
              <Text className="text-sm text-textSecondary mt-1">
                {listDescription.length}/200 karakter
              </Text>
            </View>


            <TouchableOpacity
              className={`${
                loading || !listTitle.trim() 
                  ? 'bg-gray-300' 
                  : 'bg-primary active:bg-primary-dark'
              } py-4 px-6 rounded-lg mt-8`}
              onPress={handleCreateList}
              disabled={loading || !listTitle.trim()}
            >
              <Text className="text-white font-bold text-base text-center">
                {loading ? 'Liste Oluşturuluyor...' : 'Liste Oluştur'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <>
      {renderMainScreen()}
      {renderModal()}
    </>
  );
} 
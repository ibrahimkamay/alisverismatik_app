import React, { useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../../contexts/AuthContext';
import { useLists } from '../../../hooks/useLists';
import { MainStackParamList } from '../../navigation/MainNavigator';

type NavigationProp = StackNavigationProp<MainStackParamList, 'MainTabs'>;

export function ListsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const { lists, loading, error, deleteList, refreshLists } = useLists(user?.id || null);
  const openSwipeableRef = useRef<Swipeable | null>(null);


  useFocusEffect(
    React.useCallback(() => {
      refreshLists();
    }, [refreshLists])
  );

  const handleDeleteList = (listId: string, listTitle: string) => {
    Alert.alert(
      'Liste Silme',
      `"${listTitle}" listesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`,
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteList(listId);
              Alert.alert('Başarılı', 'Liste başarıyla silindi');
            } catch (error: any) {
              Alert.alert('Hata', error.message || 'Liste silinirken bir hata oluştu');
            }
          },
        },
      ]
    );
  };

  const renderDeleteAction = (listId: string, listTitle: string) => {
    return (
      <View className="flex-1 flex-row">
        <View className="flex-1" />
        <Animated.View className="bg-red-500 justify-center items-center px-6 rounded-r-xl">
          <TouchableOpacity
            className="items-center justify-center h-full px-4"
            onPress={() => handleDeleteList(listId, listTitle)}
          >
            <Ionicons name="trash-outline" size={24} color="white" />
            <Text className="text-white text-sm font-medium mt-1">Sil</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const closeOpenSwipeable = () => {
    if (openSwipeableRef.current) {
      openSwipeableRef.current.close();
      openSwipeableRef.current = null;
    }
  };

  const handleListPress = (item: typeof lists[0]) => {
    closeOpenSwipeable();
    navigation.navigate('Categories', {
      listId: item.id,
      listTitle: item.title
    });
  };

  const renderListItem = ({ item }: { item: typeof lists[0] }) => (
    <Swipeable
      ref={(ref) => {
        if (ref && openSwipeableRef.current && openSwipeableRef.current !== ref) {
          openSwipeableRef.current.close();
        }
        if (ref) {
          openSwipeableRef.current = ref;
        }
      }}
      renderRightActions={() => renderDeleteAction(item.id, item.title)}
      rightThreshold={40}
    >
      <TouchableOpacity 
        className="bg-card p-4 rounded-xl shadow-sm mb-4 mx-4"
        onPress={() => handleListPress(item)}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-xl font-semibold text-textPrimary mb-1">{item.title}</Text>
            <Text className="text-base text-textSecondary">
              {item.itemCount} ürün • {new Date(item.created_at).toLocaleDateString('tr-TR')}
            </Text>
            {item.description && (
              <Text className="text-sm text-textSecondary mt-1" numberOfLines={2}>
                {item.description}
              </Text>
            )}
          </View>
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
              <Text className="text-white font-bold text-sm">{item.itemCount}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-8">
      <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
        <Ionicons name="basket-outline" size={48} color="#9CA3AF" />
      </View>
      <Text className="text-2xl font-bold text-textPrimary mb-2 text-center">
        Henüz liste yok
      </Text>
      <Text className="text-base text-textSecondary text-center mb-8">
        İlk alışveriş listenizi oluşturmak için alt menüdeki + butonuna dokunun
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#2b703b" />
      <Text className="text-base text-textSecondary mt-4">Listeler yükleniyor...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View className="flex-1 items-center justify-center px-8">
      <View className="w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-6">
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
      </View>
      <Text className="text-xl font-bold text-textPrimary mb-2 text-center">
        Bir hata oluştu
      </Text>
      <Text className="text-base text-textSecondary text-center mb-8">
        {error}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">

      <View className="px-4 py-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-textPrimary">Listelerim</Text>
            <Text className="text-base text-textSecondary">
              {lists.length} aktif liste
            </Text>
          </View>
          <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
            <Ionicons name="search" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>


      {loading ? (
        renderLoadingState()
      ) : error ? (
        renderErrorState()
      ) : (
        <FlatList
          data={lists}
          renderItem={renderListItem}
          keyExtractor={(item) => `list-${item.id}`}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          onScrollBeginDrag={closeOpenSwipeable}
        />
      )}
    </SafeAreaView>
  );
} 
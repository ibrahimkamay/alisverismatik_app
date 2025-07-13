import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { categories } from '../../../data/staticData';
import { MainStackParamList } from '../../navigation/MainNavigator';

type RouteParams = {
  ShoppingCompleted: {
    listId: string;
    listTitle: string;
    completedItems: Array<{
      id: string;
      name: string;
      quantity: number;
      unitPrice: number;
      categoryId: string;
      categoryName: string;
    }>;
  };
};

interface CategorySummary {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    categoryId: string;
    categoryName: string;
  }>;
  totalPrice: number;
  itemCount: number;
}

export function ShoppingCompletedScreen() {
  const route = useRoute<RouteProp<RouteParams, 'ShoppingCompleted'>>();
  const navigation = useNavigation();
  const { listId, listTitle, completedItems } = route.params;

  const getCategorySummaries = (): CategorySummary[] => {
    const categoryMap = new Map<string, CategorySummary>();

    completedItems.forEach(item => {
      if (!categoryMap.has(item.categoryId)) {
        const categoryInfo = categories?.find((cat: any) => cat.id === item.categoryId);
        
        categoryMap.set(item.categoryId, {
          categoryId: item.categoryId,
          categoryName: item.categoryName,
          categoryIcon: (categoryInfo as any)?.icon || 'basket',
          categoryColor: (categoryInfo as any)?.color || '#6B7280',
          items: [],
          totalPrice: 0,
          itemCount: 0
        });
      }

      const category = categoryMap.get(item.categoryId)!;
      category.items.push(item);
      category.totalPrice += item.unitPrice * item.quantity;
      category.itemCount++;
    });

    return Array.from(categoryMap.values());
  };

  const getTotalPrice = () => {
    return completedItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  };

  const handleShareList = async () => {
    try {
      const categorySummaries = getCategorySummaries();
      const totalPrice = getTotalPrice();
      
      let shareText = `🛒 ${listTitle} - Alışveriş Özeti\n\n`;
      
      categorySummaries.forEach(category => {
        shareText += `📁 ${category.categoryName} (${category.itemCount} ürün)\n`;
        category.items.forEach(item => {
          shareText += `   • ${item.name} - ₺${item.unitPrice.toFixed(2)}\n`;
        });
        shareText += `   Kategori toplamı: ₺${category.totalPrice.toFixed(2)}\n\n`;
      });
      
      shareText += `💰 Toplam Harcama: ₺${totalPrice.toFixed(2)}\n`;
      shareText += `📱 Alışverişmatik ile oluşturuldu`;

      await Share.share({
        message: shareText,
        title: 'Alışveriş Özeti'
      });
    } catch (error) {
      Alert.alert('Hata', 'Paylaşım sırasında bir hata oluştu');
    }
  };

  const handleCreateNewList = () => {
    Alert.alert(
      'Yeni Liste',
      'Yeni bir alışveriş listesi oluşturmak istiyor musunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Oluştur', onPress: () => (navigation as any).navigate('MainTabs', { screen: 'CreateList' }) }
      ]
    );
  };

  const categorySummaries = getCategorySummaries();
  const totalPrice = getTotalPrice();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-100">
        <View className="flex-1">
          <Text className="text-lg font-bold text-textPrimary">Alışveriş Tamamlandı!</Text>
          <Text className="text-sm text-textSecondary">{listTitle}</Text>
        </View>
        <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center">
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <View className="bg-green-500 rounded-xl p-6 mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-white text-2xl font-bold">₺{totalPrice.toFixed(2)}</Text>
                <Text className="text-green-100 text-sm">Toplam Harcama</Text>
              </View>
              <View className="items-end">
                <Text className="text-white text-lg font-semibold">{completedItems.length}</Text>
                <Text className="text-green-100 text-sm">Ürün</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="calendar" size={16} color="#D1FAE5" />
              <Text className="text-green-100 text-sm ml-2">
                {new Date().toLocaleDateString('tr-TR')}
              </Text>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-textPrimary mb-4">Kategori Özeti</Text>
            {categorySummaries.map((category) => (
              <View key={category.categoryId} className="bg-white rounded-lg p-4 mb-3 shadow-sm">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <View 
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: category.categoryColor }}
                    >
                      <Ionicons name={category.categoryIcon as any} size={20} color="white" />
                    </View>
                    <View>
                      <Text className="text-base font-medium text-textPrimary">
                        {category.categoryName}
                      </Text>
                      <Text className="text-sm text-textSecondary">
                        {category.itemCount} ürün
                      </Text>
                    </View>
                  </View>
                  <Text className="text-lg font-bold text-primary">
                    ₺{category.totalPrice.toFixed(2)}
                  </Text>
                </View>
                
                <View className="space-y-2">
                  {category.items.map((item) => (
                    <View key={item.id} className="flex-row justify-between items-center py-1">
                      <Text className="text-sm text-textSecondary flex-1">
                        {item.name}
                      </Text>
                      <Text className="text-sm font-medium text-textPrimary">
                        ₺{item.unitPrice.toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold text-textPrimary mb-4">Alışveriş İpuçları</Text>
            <View className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <View className="flex-row items-start">
                <Ionicons name="bulb" size={20} color="#3B82F6" />
                <View className="ml-3 flex-1">
                  <Text className="text-sm font-medium text-blue-900 mb-1">
                    Tasarruf Fırsatı
                  </Text>
                  <Text className="text-sm text-blue-700">
                    Benzer ürünler için fiyat karşılaştırması yaparak daha fazla tasarruf edebilirsiniz.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="bg-white border-t border-gray-100 p-6">
        <View className="flex-row" style={{ gap: 10 }}>
          <View className="flex-1" style={{ gap: 10 }}>
            <TouchableOpacity
              className="bg-primary py-4 rounded-lg flex-row items-center justify-center"
              onPress={handleShareList}
            >
              <Ionicons name="share" size={18} color="white" style={{ marginRight: 8 }} />
              <Text className="text-white font-semibold">Listeyi Paylaş</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-gray-100 py-4 rounded-lg flex-row items-center justify-center"
              onPress={() => (navigation as any).navigate('ListSummary', { 
                listId, 
                listTitle,
                addedProducts: completedItems 
              })}
            >
              <Ionicons name="create" size={18} color="#6B7280" style={{ marginRight: 8 }} />
              <Text className="text-gray-700 font-semibold">Listeyi Düzenle</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1" style={{ gap: 10 }}>
            <TouchableOpacity
              className="bg-gray-800 py-4 rounded-lg flex-row items-center justify-center"
              onPress={handleCreateNewList}
            >
              <Ionicons name="add-circle" size={18} color="white" style={{ marginRight: 8 }} />
              <Text className="text-white font-semibold">Yeni Liste</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-gray-100 py-4 rounded-lg flex-row items-center justify-center"
              onPress={() => (navigation as any).navigate('MainTabs', { screen: 'Lists' })}
            >
              <Ionicons name="home" size={18} color="#6B7280" style={{ marginRight: 8 }} />
              <Text className="text-gray-700 font-semibold">Ana Sayfa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
} 
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { categories } from '../../../data/staticData';

type RouteParams = {
  ListSummary: {
    listId: string;
    listTitle: string;
    addedProducts?: Array<{
      id: string;
      name: string;
      quantity: number;
      unitPrice: number;
      categoryId: string;
      categoryName: string;
    }>;
  };
};

interface ListItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  categoryId: string;
  categoryName: string;
  isCompleted: boolean;
}

interface CategorySummary {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  items: ListItem[];
  totalPrice: number;
  completedItems: number;
}

export function ListSummaryScreen() {
  const route = useRoute<RouteProp<RouteParams, 'ListSummary'>>();
  const navigation = useNavigation();
  const { listId, listTitle, addedProducts } = route.params;

  const [listItems, setListItems] = useState<ListItem[]>(
    addedProducts?.map(product => ({
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      unitPrice: product.unitPrice,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      isCompleted: false
    })) || []
  );

  const toggleItemCompletion = (itemId: string) => {
    setListItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
    ));
  };

  const getCategorySummaries = (): CategorySummary[] => {
    const categoryMap = new Map<string, CategorySummary>();

    listItems.forEach(item => {
      if (!categoryMap.has(item.categoryId)) {
        const categoryInfo = categories?.find((cat: any) => cat.id === item.categoryId);
        
        categoryMap.set(item.categoryId, {
          categoryId: item.categoryId,
          categoryName: item.categoryName,
          categoryIcon: (categoryInfo as any)?.icon || 'basket',
          categoryColor: (categoryInfo as any)?.color || '#6B7280',
          items: [],
          totalPrice: 0,
          completedItems: 0
        });
      }

      const category = categoryMap.get(item.categoryId)!;
      category.items.push(item);
      if (!item.isCompleted) {
        category.totalPrice += item.unitPrice;
      }
      if (item.isCompleted) {
        category.completedItems++;
      }
    });

    return Array.from(categoryMap.values());
  };

  const getTotalPrice = () => {
    return listItems.reduce((sum, item) => sum + (item.isCompleted ? 0 : item.unitPrice), 0);
  };

  const getCompletedItemsCount = () => {
    return listItems.filter(item => item.isCompleted).length;
  };

  const renderListItem = ({ item }: { item: ListItem }) => (
    <TouchableOpacity
      className={`bg-white p-4 rounded-lg shadow-sm mb-2 border-l-4 ${
        item.isCompleted ? 'border-green-500 bg-green-50' : 'border-gray-300'
      }`}
      onPress={() => toggleItemCompletion(item.id)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className={`text-base font-medium ${
            item.isCompleted ? 'text-green-700 line-through' : 'text-textPrimary'
          }`}>
            {item.name}
          </Text>
          <Text className={`text-sm ${
            item.isCompleted ? 'text-green-600' : 'text-textSecondary'
          }`}>
            ₺{item.unitPrice.toFixed(2)}
          </Text>
        </View>
        
        <View className="items-end">
          <Text className={`text-lg font-bold ${
            item.isCompleted ? 'text-green-700' : 'text-primary'
          }`}>
            ₺{item.unitPrice.toFixed(2)}
          </Text>
          {item.isCompleted ? (
            <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center mt-1">
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
          ) : (
            <View className="w-6 h-6 border-2 border-gray-300 rounded-full mt-1" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategorySection = (category: CategorySummary) => (
    <View key={category.categoryId} className="mb-6">
      <View className="flex-row items-center justify-between mb-3 px-4">
        <View className="flex-row items-center">
          <View 
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: category.categoryColor }}
          >
            <Ionicons name={category.categoryIcon as any} size={20} color="white" />
          </View>
          <View>
                        <Text className="text-lg font-semibold text-textPrimary">
              {category.categoryName}
            </Text>
          </View>
        </View>
        <Text className="text-lg font-bold text-primary">
          ₺{category.totalPrice.toFixed(2)}
        </Text>
      </View>
      
      <View className="px-4">
        <FlatList
          data={category.items}
          renderItem={renderListItem}
          keyExtractor={(item) => `${category.categoryId}-${item.id}`}
          scrollEnabled={false}
        />
      </View>
    </View>
  );

  const categories = getCategorySummaries();
  const totalPrice = getTotalPrice();
  const completedCount = getCompletedItemsCount();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 py-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#2b703b" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => (navigation as any).navigate('Categories', { 
            listId, 
            listTitle,
            existingProducts: listItems.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              categoryId: item.categoryId,
              categoryName: item.categoryName
            }))
          })}>
            <Ionicons name="add" size={24} color="#2b703b" />
          </TouchableOpacity>
        </View>
        
        <Text className="text-2xl font-bold text-textPrimary mb-1">{listTitle}</Text>
        <Text className="text-base text-textSecondary">
          {listItems.length} ürün • ₺{totalPrice.toFixed(2)}
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="py-4">
          {listItems.length === 0 ? (
            <View className="flex-1 items-center justify-center px-8 py-16">
              <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
                <Ionicons name="basket-outline" size={48} color="#9CA3AF" />
              </View>
              <Text className="text-xl font-bold text-textPrimary mb-2 text-center">
                Liste boş
              </Text>
              <Text className="text-base text-textSecondary text-center">
                Kategorilerden ürün ekleyerek alışveriş listenizi oluşturun
              </Text>
            </View>
                     ) : (
             getCategorySummaries().map(category => renderCategorySection(category))
           )}
        </View>
      </ScrollView>

      <View className="border-t border-gray-100 p-4 bg-white">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-sm text-textSecondary">Toplam Tutar</Text>
                        <Text className="text-2xl font-bold text-primary">₺{totalPrice.toFixed(2)}</Text>
          </View>
        </View>
        
        <View className="flex-row space-x-3">
          <TouchableOpacity
            className="flex-1 bg-gray-100 py-3 rounded-lg flex-row items-center justify-center"
            onPress={() => (navigation as any).navigate('Categories', { 
              listId, 
              listTitle,
              existingProducts: listItems.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                categoryId: item.categoryId,
                categoryName: item.categoryName
              }))
            })}
          >
            <Ionicons name="add-outline" size={20} color="#6B7280" style={{ marginRight: 8 }} />
            <Text className="text-gray-700 font-semibold">Ürün Ekle</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-1 bg-primary py-3 rounded-lg flex-row items-center justify-center"
            onPress={() => {
              const completedItems = listItems.filter(item => item.isCompleted);
              if (completedItems.length === 0) {
                Alert.alert('Uyarı', 'Lütfen en az bir ürünü tamamlayın!');
                return;
              }
              (navigation as any).navigate('ShoppingCompleted', {
                listId,
                listTitle,
                completedItems: completedItems.map(item => ({
                  id: item.id,
                  name: item.name,
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                  categoryId: item.categoryId,
                  categoryName: item.categoryName
                }))
              });
            }}
          >
            <Ionicons name="checkmark-circle" size={20} color="white" style={{ marginRight: 8 }} />
            <Text className="text-white font-semibold">Alışverişi Tamamla</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
} 
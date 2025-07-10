import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { categories } from '../../../data/staticData';

type RouteParams = {
  Categories: {
    listId: string;
    listTitle: string;
  };
};

type NavigationProp = StackNavigationProp<MainStackParamList, 'Categories'>;

export function CategoriesScreen() {
  const route = useRoute<RouteProp<RouteParams, 'Categories'>>();
  const navigation = useNavigation<NavigationProp>();
  const { listId, listTitle } = route.params;

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    navigation.navigate('CategoryProducts', {
      listId,
      listTitle,
      categoryId,
      categoryName
    });
  };

  const renderCategoryItem = ({ item, index }: { item: typeof categories[0], index: number }) => (
    <TouchableOpacity
      className="flex-1 mx-2 mb-4 bg-white rounded-2xl shadow-sm overflow-hidden"
      style={{ backgroundColor: item.color + '15' }}
      onPress={() => handleCategoryPress(item.id, item.name)}
      activeOpacity={0.8}
    >
      <View className="p-6 items-center justify-center min-h-[140px]">
        <View 
          className="w-16 h-16 rounded-full items-center justify-center mb-3"
          style={{ backgroundColor: item.color }}
        >
          <Ionicons name={item.icon as any} size={28} color="white" />
        </View>
        
        <Text className="text-center text-sm font-semibold text-textPrimary mb-1" numberOfLines={2}>
          {item.name}
        </Text>
        
        <Text className="text-xs text-textSecondary">
          {item.productCount} ürün
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 py-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#2b703b" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
        
        <Text className="text-2xl font-bold text-textPrimary mb-1">{listTitle}</Text>
        <Text className="text-base text-textSecondary">
          Kategori seçin ve ürün ekleyin
        </Text>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
    </SafeAreaView>
  );
} 
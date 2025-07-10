import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { products } from '../../../data/staticData';

type RouteParams = {
  CategoryProducts: {
    listId: string;
    listTitle: string;
    categoryId: string;
    categoryName: string;
  };
};

interface SelectedProduct {
  id: string;
  name: string;
  unit: string;
  quantity: number;
}

export function CategoryProductsScreen() {
  const route = useRoute<RouteProp<RouteParams, 'CategoryProducts'>>();
  const navigation = useNavigation();
  const { listId, listTitle, categoryId, categoryName } = route.params;
  
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [searchText, setSearchText] = useState('');
  
  const categoryProducts = products[categoryId as keyof typeof products] || [];
  
  const filteredProducts = categoryProducts.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleProductToggle = (product: typeof categoryProducts[0]) => {
    const existingIndex = selectedProducts.findIndex(p => p.id === product.id);
    
    if (existingIndex >= 0) {
      setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
    } else {
      setSelectedProducts(prev => [...prev, {
        id: product.id,
        name: product.name,
        unit: product.unit,
        quantity: 1
      }]);
    }
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    } else {
      setSelectedProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, quantity } : p
      ));
    }
  };

  const handleAddToList = () => {
    if (selectedProducts.length === 0) {
      Alert.alert('Uyarı', 'Lütfen en az bir ürün seçin');
      return;
    }

    Alert.alert(
      'Başarılı', 
      `${selectedProducts.length} ürün "${listTitle}" listesine eklendi!`,
      [
        {
          text: 'Tamam',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const isProductSelected = (productId: string) => {
    return selectedProducts.some(p => p.id === productId);
  };

  const getProductQuantity = (productId: string) => {
    return selectedProducts.find(p => p.id === productId)?.quantity || 1;
  };

  const renderProductItem = ({ item }: { item: typeof categoryProducts[0] }) => {
    const isSelected = isProductSelected(item.id);
    const quantity = getProductQuantity(item.id);

    return (
      <TouchableOpacity
        className={`bg-card p-4 rounded-xl shadow-sm mb-3 mx-4 border-2 ${
          isSelected ? 'border-primary bg-primary-light bg-opacity-10' : 'border-transparent'
        }`}
        onPress={() => handleProductToggle(item)}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-base font-medium text-textPrimary mb-1">
              {item.name}
            </Text>
            <Text className="text-sm text-textSecondary">
              Birim: {item.unit}
            </Text>
          </View>
          
          {isSelected ? (
            <View className="flex-row items-center">
              <TouchableOpacity
                className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center"
                onPress={() => updateProductQuantity(item.id, quantity - 1)}
              >
                <Ionicons name="remove" size={16} color="#6B7280" />
              </TouchableOpacity>
              
              <Text className="mx-3 text-base font-bold text-primary min-w-[20px] text-center">
                {quantity}
              </Text>
              
              <TouchableOpacity
                className="w-8 h-8 bg-primary rounded-full items-center justify-center"
                onPress={() => updateProductQuantity(item.id, quantity + 1)}
              >
                <Ionicons name="add" size={16} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="w-6 h-6 border-2 border-gray-300 rounded-full" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
        <Ionicons name="search" size={48} color="#9CA3AF" />
      </View>
      <Text className="text-xl font-bold text-textPrimary mb-2 text-center">
        Ürün bulunamadı
      </Text>
      <Text className="text-base text-textSecondary text-center">
        "{searchText}" araması için sonuç bulunamadı
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 py-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#2b703b" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-textPrimary">{categoryName}</Text>
          <View className="w-6" />
        </View>
        
        <TextInput
          className="bg-inputBg border border-gray-300 text-textPrimary text-base rounded-lg p-3 mb-2"
          placeholder="Ürün ara..."
          placeholderTextColor="#9CA3AF"
          value={searchText}
          onChangeText={setSearchText}
        />
        
        <Text className="text-sm text-textSecondary">
          {filteredProducts.length} ürün • {selectedProducts.length} seçili
        </Text>
      </View>

      <View className="flex-1">
        {filteredProducts.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {selectedProducts.length > 0 && (
        <View className="border-t border-gray-100 p-4 bg-white">
          <TouchableOpacity
            className="bg-primary py-4 rounded-lg flex-row items-center justify-center"
            onPress={handleAddToList}
          >
            <Ionicons name="basket" size={20} color="white" style={{ marginRight: 8 }} />
            <Text className="text-white font-bold text-base">
              {selectedProducts.length} Ürünü Listeye Ekle
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
} 
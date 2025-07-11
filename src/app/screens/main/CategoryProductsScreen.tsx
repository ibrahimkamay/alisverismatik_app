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
    existingProducts?: Array<{
      id: string;
      name: string;
      quantity: number;
      unitPrice: number;
      categoryId: string;
      categoryName: string;
    }>;
  };
};

interface SelectedProduct {
  id: string;
  name: string;
  quantity: number;
}

export function CategoryProductsScreen() {
  const route = useRoute<RouteProp<RouteParams, 'CategoryProducts'>>();
  const navigation = useNavigation();
  const { listId, listTitle, categoryId, categoryName, existingProducts } = route.params;
  
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [searchText, setSearchText] = useState('');
  
  const categoryProducts = products[categoryId as keyof typeof products] || [];
  
  // Bu kategoriden zaten eklenmiş ürünleri bul
  const existingProductsInThisCategory = existingProducts?.filter(p => p.categoryId === categoryId) || [];
  
  const filteredProducts = categoryProducts.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const isProductAlreadyAdded = (productId: string) => {
    return existingProductsInThisCategory.some(p => p.id === productId);
  };

  const handleProductRemove = (productId: string, productName: string) => {
    Alert.alert(
      'Ürünü Kaldır',
      `"${productName}" ürünü listeden kaldırmak istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Kaldır',
          style: 'destructive',
          onPress: () => {
            // Ürünü existing products'tan kaldır
            const updatedExistingProducts = existingProducts?.filter(p => p.id !== productId) || [];
            
            // Categories ekranına geri dön updated existingProducts ile
            (navigation as any).navigate('Categories', {
              listId,
              listTitle,
              existingProducts: updatedExistingProducts
            });
          }
        }
      ]
    );
  };

  const handleProductToggle = (product: typeof categoryProducts[0]) => {
    // Zaten eklenmiş ürünleri kaldırma seçeneği sun
    if (isProductAlreadyAdded(product.id)) {
      handleProductRemove(product.id, product.name);
      return;
    }

    const existingIndex = selectedProducts.findIndex(p => p.id === product.id);
    
    if (existingIndex >= 0) {
      setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
    } else {
      setSelectedProducts(prev => [...prev, {
        id: product.id,
        name: product.name,
        quantity: 1
      }]);
    }
  };

  const handleContinue = () => {
    if (selectedProducts.length === 0) {
      Alert.alert('Uyarı', 'Lütfen en az bir ürün seçin');
      return;
    }

    (navigation as any).navigate('PriceEntry', {
      listId,
      listTitle,
      categoryName,
      selectedProducts,
      existingProducts
    });
  };

  const isProductSelected = (productId: string) => {
    return selectedProducts.some(p => p.id === productId);
  };

  const renderProductItem = ({ item }: { item: typeof categoryProducts[0] }) => {
    const isSelected = isProductSelected(item.id);
    const isAlreadyAdded = isProductAlreadyAdded(item.id);

    return (
      <TouchableOpacity
        className={`bg-card p-4 rounded-xl shadow-sm mb-3 mx-4 border-2 ${
          isAlreadyAdded 
            ? 'border-green-500 bg-green-50' 
            : isSelected 
              ? 'border-primary bg-primary-light bg-opacity-10' 
              : 'border-transparent'
        }`}
        onPress={() => handleProductToggle(item)}
        activeOpacity={isAlreadyAdded ? 0.5 : 0.7}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className={`text-base font-medium ${
              isAlreadyAdded ? 'text-green-700' : 'text-textPrimary'
            }`}>
              {item.name}
            </Text>
            {isAlreadyAdded && (
              <Text className="text-xs text-green-600 mt-1">
                Listede mevcut
              </Text>
            )}
          </View>
          
          {isAlreadyAdded ? (
            <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center">
              <Ionicons name="checkmark-done" size={16} color="white" />
            </View>
          ) : isSelected ? (
            <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
              <Ionicons name="checkmark" size={16} color="white" />
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
          {existingProducts && existingProducts.length > 0 ? (
            <TouchableOpacity onPress={() => (navigation as any).navigate('ListSummary', {
              listId,
              listTitle,
              addedProducts: existingProducts
            })}>
              <Ionicons name="list" size={24} color="#2b703b" />
            </TouchableOpacity>
          ) : (
            <View className="w-6" />
          )}
        </View>
        
        <TextInput
          className="bg-inputBg border border-gray-300 text-textPrimary text-base rounded-lg p-3 mb-2"
          placeholder="Ürün ara..."
          placeholderTextColor="#9CA3AF"
          value={searchText}
          onChangeText={setSearchText}
        />
        
        <Text className="text-sm text-textSecondary">
          {filteredProducts.length} ürün • {selectedProducts.length} yeni seçili • {existingProductsInThisCategory.length} listede
        </Text>
      </View>

      <View className="flex-1">
        {filteredProducts.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => `${categoryId}-${item.id}`}
            contentContainerStyle={{ paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {(selectedProducts.length > 0 || (existingProducts && existingProducts.length > 0)) && (
        <View className="border-t border-gray-100 p-4 bg-white">
          {selectedProducts.length > 0 ? (
            <TouchableOpacity
              className="bg-primary py-4 rounded-lg flex-row items-center justify-center"
              onPress={handleContinue}
            >
              <Ionicons name="basket" size={20} color="white" style={{ marginRight: 8 }} />
              <Text className="text-white font-bold text-base">
                Devam Et ({selectedProducts.length} ürün)
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-gray-100 py-4 rounded-lg flex-row items-center justify-center"
              onPress={() => (navigation as any).navigate('ListSummary', {
                listId,
                listTitle,
                addedProducts: existingProducts
              })}
            >
              <Ionicons name="list" size={20} color="#6B7280" style={{ marginRight: 8 }} />
              <Text className="text-gray-700 font-bold text-base">
                Liste Özetini Görüntüle ({existingProducts?.length || 0} ürün)
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
} 
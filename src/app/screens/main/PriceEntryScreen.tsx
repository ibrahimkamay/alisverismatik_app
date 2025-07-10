import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';

type RouteParams = {
  PriceEntry: {
    listId: string;
    listTitle: string;
    categoryName: string;
    selectedProducts: Array<{
      id: string;
      name: string;
      unit: string;
      quantity: number;
    }>;
  };
};

interface ProductWithPrice {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  price: string;
}

export function PriceEntryScreen() {
  const route = useRoute<RouteProp<RouteParams, 'PriceEntry'>>();
  const navigation = useNavigation();
  const { listId, listTitle, categoryName, selectedProducts } = route.params;
  
  const [productsWithPrices, setProductsWithPrices] = useState<ProductWithPrice[]>(
    selectedProducts.map(product => ({
      ...product,
      price: ''
    }))
  );

  const updateProductPrice = (productId: string, price: string) => {
    const numericPrice = price.replace(/[^0-9.,]/g, '').replace(',', '.');
    
    setProductsWithPrices(prev => prev.map(p => 
      p.id === productId ? { ...p, price: numericPrice } : p
    ));
  };

  const handleAddToList = () => {
    const missingPrices = productsWithPrices.filter(p => !p.price || parseFloat(p.price) <= 0);
    
    if (missingPrices.length > 0) {
      Alert.alert(
        'Eksik Fiyat',
        `Lütfen ${missingPrices.length} ürün için fiyat girin`,
        [{ text: 'Tamam' }]
      );
      return;
    }

    (navigation as any).navigate('Lists');
  };

  const getTotalPrice = () => {
    return productsWithPrices.reduce((sum, p) => {
      const price = parseFloat(p.price) || 0;
      return sum + (price * p.quantity);
    }, 0).toFixed(2);
  };

  const getValidPriceCount = () => {
    return productsWithPrices.filter(p => p.price && parseFloat(p.price) > 0).length;
  };

  const renderProductItem = ({ item }: { item: ProductWithPrice }) => {
    const unitPrice = parseFloat(item.price) || 0;
    const totalItemPrice = (unitPrice * item.quantity).toFixed(2);

    return (
      <View className="bg-card p-4 rounded-xl shadow-sm mb-3 mx-4 border border-gray-200">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-base font-medium text-textPrimary">
              {item.name}
            </Text>
          </View>
        </View>
        
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <TextInput
              className="bg-inputBg border border-gray-300 text-textPrimary text-base rounded-lg p-3"
              placeholder="Fiyat girin..."
              placeholderTextColor="#9CA3AF"
              value={item.price}
              onChangeText={(text) => updateProductPrice(item.id, text)}
              keyboardType="numeric"
            />
          </View>
          
          <View className="items-end">
            <Text className="text-lg font-bold text-primary">
              ₺{totalItemPrice}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="px-4 py-4 border-b border-gray-100">
          <View className="flex-row items-center justify-between mb-3">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#2b703b" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-textPrimary">Fiyat Gir</Text>
            <View className="w-6" />
          </View>
          
          <View className="items-center">
            <Text className="text-base font-medium text-textPrimary text-center">
              {categoryName}
            </Text>
            <Text className="text-sm text-textSecondary text-center mt-1">
              {productsWithPrices.length} ürün seçildi
            </Text>
          </View>
        </View>

        <View className="flex-1">
          <FlatList
            data={productsWithPrices}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View className="border-t border-gray-100 p-4 bg-white">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-sm text-textSecondary">
              {getValidPriceCount()}/{productsWithPrices.length} fiyat girildi
            </Text>
            <Text className="text-lg font-bold text-primary">
              Toplam: ₺{getTotalPrice()}
            </Text>
          </View>
          
          <TouchableOpacity
            className={`py-4 rounded-lg flex-row items-center justify-center ${
              getValidPriceCount() === productsWithPrices.length 
                ? 'bg-primary' 
                : 'bg-gray-300'
            }`}
            onPress={handleAddToList}
            disabled={getValidPriceCount() !== productsWithPrices.length}
          >
            <Ionicons 
              name="basket" 
              size={20} 
              color={getValidPriceCount() === productsWithPrices.length ? "white" : "#9CA3AF"} 
              style={{ marginRight: 8 }} 
            />
            <Text className={`font-bold text-base ${
              getValidPriceCount() === productsWithPrices.length 
                ? 'text-white' 
                : 'text-gray-500'
            }`}>
              Listeye Ekle
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 
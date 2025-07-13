import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ListsScreen } from '../screens/main/ListsScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { CreateListModal } from '../screens/main/CreateListModal';
import { CategoriesScreen } from '../screens/main/CategoriesScreen';
import { CategoryProductsScreen } from '../screens/main/CategoryProductsScreen';
import { PriceEntryScreen } from '../screens/main/PriceEntryScreen';
import { ListSummaryScreen } from '../screens/main/ListSummaryScreen';
import { ShoppingCompletedScreen } from '../screens/main/ShoppingCompletedScreen';

export type MainStackParamList = {
  MainTabs: undefined;
  Categories: {
    listId: string;
    listTitle: string;
    existingProducts?: Array<{
      id: string;
      name: string;
      quantity: number;
      unitPrice: number;
      categoryId: string;
      categoryName: string;
    }>;
  };
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
  PriceEntry: {
    listId: string;
    listTitle: string;
    categoryName: string;
    selectedProducts: Array<{
      id: string;
      name: string;
      quantity: number;
    }>;
    existingProducts?: Array<{
      id: string;
      name: string;
      quantity: number;
      unitPrice: number;
      categoryId: string;
      categoryName: string;
    }>;
  };
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

export type MainTabParamList = {
  Lists: undefined;
  CreateList: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Lists') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'CreateList') {
            iconName = 'add-circle';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2b703b',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingVertical: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Lists" 
        component={ListsScreen} 
        options={{ tabBarLabel: 'Listelerim' }}
      />
      <Tab.Screen 
        name="CreateList" 
        component={CreateListModal} 
        options={{ 
          tabBarLabel: 'Yeni Liste',
          tabBarIconStyle: { fontSize: 32 }
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
}

export function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabNavigator} 
      />
      <Stack.Screen 
        name="Categories" 
        component={CategoriesScreen} 
      />
      <Stack.Screen 
        name="CategoryProducts" 
        component={CategoryProductsScreen} 
      />
      <Stack.Screen 
        name="PriceEntry" 
        component={PriceEntryScreen} 
      />
      <Stack.Screen 
        name="ListSummary" 
        component={ListSummaryScreen} 
      />
      <Stack.Screen 
        name="ShoppingCompleted" 
        component={ShoppingCompletedScreen} 
      />
    </Stack.Navigator>
  );
} 
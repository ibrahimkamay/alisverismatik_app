import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ListsScreen } from '../screens/main/ListsScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { CreateListModal } from '../screens/main/CreateListModal';
import { CategoriesScreen } from '../screens/main/CategoriesScreen';
import { CategoryProductsScreen } from '../screens/main/CategoryProductsScreen';

export type MainStackParamList = {
  MainTabs: undefined;
  Categories: {
    listId: string;
    listTitle: string;
  };
  CategoryProducts: {
    listId: string;
    listTitle: string;
    categoryId: string;
    categoryName: string;
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
    </Stack.Navigator>
  );
} 
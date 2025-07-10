import { useState, useEffect, useCallback } from 'react';
import { listService } from '../services/listService';
import { Database } from '../types/supabase';

type ShoppingList = Database['public']['Tables']['shopping_lists']['Row'];
type ShoppingListInsert = Database['public']['Tables']['shopping_lists']['Insert'];
type ShoppingListUpdate = Database['public']['Tables']['shopping_lists']['Update'];

interface ListWithItemCount extends ShoppingList {
  itemCount: number;
}

export const useLists = (userId: string | null) => {
  const [lists, setLists] = useState<ListWithItemCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLists = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await listService.getListsWithItemCount(userId);
      setLists(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch lists');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createList = async (listData: Omit<ShoppingListInsert, 'user_id'>) => {
    if (!userId) throw new Error('User not authenticated');

    try {
      setError(null);
      const newList = await listService.createList({
        ...listData,
        user_id: userId
      });
      

      setLists(prev => [{
        ...newList,
        itemCount: 0
      }, ...prev]);
      
      return newList;
    } catch (err: any) {
      setError(err.message || 'Failed to create list');
      throw err;
    }
  };

  const updateList = async (listId: string, updates: ShoppingListUpdate) => {
    try {
      setError(null);
      const updatedList = await listService.updateList(listId, updates);
      
      setLists(prev => prev.map(list => 
        list.id === listId 
          ? { ...updatedList, itemCount: list.itemCount }
          : list
      ));
      
      return updatedList;
    } catch (err: any) {
      setError(err.message || 'Failed to update list');
      throw err;
    }
  };

  const deleteList = async (listId: string) => {
    try {
      setError(null);
      await listService.deleteList(listId);
      
      setLists(prev => prev.filter(list => list.id !== listId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete list');
      throw err;
    }
  };

  const refreshLists = useCallback(() => {
    fetchLists();
  }, [fetchLists]);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  return {
    lists,
    loading,
    error,
    createList,
    updateList,
    deleteList,
    refreshLists
  };
}; 
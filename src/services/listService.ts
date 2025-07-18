import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type ShoppingList = Database['public']['Tables']['shopping_lists']['Row'];
type ShoppingListInsert = Database['public']['Tables']['shopping_lists']['Insert'];
type ShoppingListUpdate = Database['public']['Tables']['shopping_lists']['Update'];

export const listService = {

  async getUserLists(userId: string): Promise<ShoppingList[]> {
    const { data, error } = await supabase
      .from('shopping_lists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  },


  async getList(listId: string): Promise<ShoppingList | null> {
    const { data, error } = await supabase
      .from('shopping_lists')
      .select('*')
      .eq('id', listId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  },


  async createList(listData: ShoppingListInsert): Promise<ShoppingList> {
    const { data, error } = await supabase
      .from('shopping_lists')
      .insert(listData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },


  async updateList(listId: string, updates: ShoppingListUpdate): Promise<ShoppingList> {
    const { data, error } = await supabase
      .from('shopping_lists')
      .update(updates)
      .eq('id', listId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },


  async deleteList(listId: string): Promise<void> {
    const { error } = await supabase
      .from('shopping_lists')
      .delete()
      .eq('id', listId);

    if (error) {
      throw error;
    }
  },


  async getListsWithItemCount(userId: string) {
    const { data, error } = await supabase
      .from('shopping_lists')
      .select(`
        *,
        shopping_list_items(count)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data?.map(list => ({
      ...list,
      itemCount: list.shopping_list_items?.[0]?.count || 0
    })) || [];
  },

  async getListItems(listId: string) {
    const { data, error } = await supabase
      .from('shopping_list_items')
      .select('*')
      .eq('shopping_list_id', listId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  },

  async addListItems(listId: string, items: Array<{
    title: string;
    quantity: number;
    categoryId: string;
    categoryName: string;
    unitPrice: number;
  }>) {
    const itemsToInsert = items.map(item => ({
      shopping_list_id: listId,
      title: item.title,
      quantity: item.quantity,
      category_id: item.categoryId,
      category_name: item.categoryName,
      unit_price: item.unitPrice,
      is_completed: false
    }));

    const { data, error } = await supabase
      .from('shopping_list_items')
      .insert(itemsToInsert)
      .select();

    if (error) {
      throw error;
    }

    return data;
  },

  async updateListItem(itemId: string, updates: { 
    is_completed?: boolean;
    quantity?: number;
    unit_price?: number;
  }) {
    const { data, error } = await supabase
      .from('shopping_list_items')
      .update(updates)
      .eq('id', itemId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async deleteListItem(itemId: string) {
    const { error } = await supabase
      .from('shopping_list_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      throw error;
    }
  }
}; 
import { dummyData } from './data';

// Local storage utilities
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// Initialize storage with dummy data if empty
export const initializeStorage = () => {
  if (!storage.get('laundryCustomers')) {
    storage.set('laundryCustomers', dummyData.customers);
  }
  if (!storage.get('laundryOrders')) {
    storage.set('laundryOrders', dummyData.orders);
  }
  if (!storage.get('laundryDeliveryPersons')) {
    storage.set('laundryDeliveryPersons', dummyData.deliveryPersons);
  }
  if (!storage.get('laundryMonthlyBills')) {
    storage.set('laundryMonthlyBills', dummyData.monthlyBills);
  }
  if (!storage.get('laundryCategories')) {
    storage.set('laundryCategories', dummyData.categories);
  }
  if (!storage.get('laundryCategoryPrices')) {
    storage.set('laundryCategoryPrices', dummyData.categoryPrices);
  }
  if (!storage.get('laundryStats')) {
    storage.set('laundryStats', dummyData.stats);
  }
};
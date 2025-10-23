import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { cacheService, CACHE_KEYS, CACHE_TTL } from '../services/cacheService';
import { cookieService, COOKIE_KEYS, COOKIE_OPTIONS } from '../services/cookieService';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  discount?: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

// Load initial state from cache/cookies
const loadInitialState = (): CartState => {
  try {
    // Try to load from cache first
    const cachedCart = cacheService.get<CartState>(CACHE_KEYS.CART, {
      ttl: CACHE_TTL.CART,
      storage: 'localStorage'
    });

    if (cachedCart) {
      console.log('🛒 Cart loaded from cache');
      return cachedCart;
    }

    // Fallback to cookies
    const cookieCart = cookieService.getJSON<CartState>(COOKIE_KEYS.CART);
    if (cookieCart) {
      console.log('🛒 Cart loaded from cookies');
      return cookieCart;
    }
  } catch (error) {
    console.warn('Failed to load cart from storage:', error);
  }

  return {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  };
};

const initialState: CartState = loadInitialState();

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + action.payload.price,
        };
      } else {
        const newItem = { ...action.payload, quantity: 1 };
        return {
          ...state,
          items: [...state.items, newItem],
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + action.payload.price,
        };
      }
    }
    
    case 'REMOVE_FROM_CART': {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      if (!itemToRemove) return state;
      
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems - itemToRemove.quantity,
        totalPrice: state.totalPrice - (itemToRemove.price * itemToRemove.quantity),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: id });
      }
      
      const updatedItems = state.items.map(item => {
        if (item.id === id) {
          return { ...item, quantity };
        }
        return item;
      });
      
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice,
      };
    }
    
    case 'CLEAR_CART':
      return initialState;
    
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Persist cart to storage whenever state changes
  useEffect(() => {
    const persistCart = () => {
      try {
        // Save to cache
        cacheService.set(CACHE_KEYS.CART, state, {
          ttl: CACHE_TTL.CART,
          storage: 'localStorage'
        });

        // Save to cookies as backup
        cookieService.setJSON(COOKIE_KEYS.CART, state, COOKIE_OPTIONS.CART);
        
        console.log('🛒 Cart persisted to storage');
      } catch (error) {
        console.warn('Failed to persist cart:', error);
      }
    };

    persistCart();
  }, [state]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    // Clear from storage as well
    try {
      cacheService.remove(CACHE_KEYS.CART);
      cookieService.remove(COOKIE_KEYS.CART);
      console.log('🛒 Cart cleared from storage');
    } catch (error) {
      console.warn('Failed to clear cart from storage:', error);
    }
  };

  return (
    <CartContext.Provider value={{
      state,
      items: state.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

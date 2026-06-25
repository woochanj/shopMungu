"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { CartItem, Product } from "./types";

const STORAGE_KEY = "mungu-cart-v2";

type Action =
  | { type: "add"; product: Product; quantity: number }
  | { type: "setQty"; productId: string; quantity: number }
  | { type: "remove"; productId: string }
  | { type: "clear" }
  | { type: "hydrate"; items: CartItem[] };

function snapshotOf(p: Product): CartItem["snapshot"] {
  return {
    name: p.name,
    brand: p.brand,
    image: p.image,
    price: p.price,
    listPrice: p.listPrice,
    unitLabel: p.unitLabel,
    unitCount: p.unitCount,
    code: p.code,
  };
}

function reducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case "hydrate":
      return action.items;
    case "add": {
      const existing = state.find((i) => i.productId === action.product.id);
      if (existing) {
        return state.map((i) =>
          i.productId === action.product.id
            ? { ...i, quantity: i.quantity + action.quantity }
            : i
        );
      }
      return [
        ...state,
        {
          productId: action.product.id,
          quantity: action.quantity,
          snapshot: snapshotOf(action.product),
        },
      ];
    }
    case "setQty":
      return state
        .map((i) =>
          i.productId === action.productId
            ? { ...i, quantity: Math.max(1, action.quantity) }
            : i
        )
        .filter((i) => i.quantity > 0);
    case "remove":
      return state.filter((i) => i.productId !== action.productId);
    case "clear":
      return [];
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  totalQuantity: number;
  subtotal: number;
  add: (product: Product, quantity?: number) => void;
  setQty: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", items: JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce(
      (sum, i) => sum + i.snapshot.price * i.quantity,
      0
    );
    const totalQuantity = items.reduce((s, i) => s + i.quantity, 0);
    return {
      items,
      count: items.length,
      totalQuantity,
      subtotal,
      add: (product, quantity = 1) =>
        dispatch({ type: "add", product, quantity }),
      setQty: (productId, quantity) =>
        dispatch({ type: "setQty", productId, quantity }),
      remove: (productId) => dispatch({ type: "remove", productId }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

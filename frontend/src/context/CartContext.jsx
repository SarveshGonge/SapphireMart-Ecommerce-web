import { createContext, useContext, useState, useCallback } from "react";
import toast from "react-hot-toast";
import * as cartApi from "../api/cart";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await cartApi.fetchCart();
      setItems(data);
    } catch (err) {
      // Silently ignore — most likely an expired session, already handled by the axios interceptor.
    } finally {
      setLoading(false);
    }
  }, [user]);

  const add = useCallback(async (productId, quantity = 1) => {
    try {
      await cartApi.addToCart(productId, quantity);
      await refreshCart();
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add to cart");
    }
  }, [refreshCart]);

  const updateQuantity = useCallback(async (cartItemId, quantity) => {
    try {
      await cartApi.updateCartItem(cartItemId, quantity);
      await refreshCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update cart");
    }
  }, [refreshCart]);

  const remove = useCallback(async (cartItemId) => {
    try {
      await cartApi.removeCartItem(cartItemId);
      await refreshCart();
    } catch (err) {
      toast.error("Could not remove item");
    }
  }, [refreshCart]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.quantity * i.product.price, 0);

  return (
    <CartContext.Provider
      value={{ items, loading, refreshCart, add, updateQuantity, remove, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

function storageKey(email) {
  return `wishlist:${email || "guest"}`;
}

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [ids, setIds] = useState(() => {
    const raw = localStorage.getItem(storageKey(user?.email));
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    const raw = localStorage.getItem(storageKey(user?.email));
    setIds(raw ? JSON.parse(raw) : []);
  }, [user?.email]);

  const toggle = useCallback(
    (productId) => {
      setIds((prev) => {
        const next = prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId];
        localStorage.setItem(storageKey(user?.email), JSON.stringify(next));
        return next;
      });
    },
    [user?.email]
  );

  const isWishlisted = useCallback((productId) => ids.includes(productId), [ids]);

  return (
    <WishlistContext.Provider value={{ ids, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);

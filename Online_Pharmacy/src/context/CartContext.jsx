
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if(token){

      fetchCart();
    }

  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found, skipping cart fetch");
      return;
    }

    try {
      const response = await axios.get(
        "https://online-pharmacy-backend.onrender.com/cart/all",
        {
          headers: { token },
        }
      );
      console.log(response.data);
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const addToCart = async (item) => {
    try {
      const response = await axios.post(
        "https://online-pharmacy-backend.onrender.com/cart/add",
        {
          productId: item._id,
          quantity: 1,
        },
        { headers: { token } }
      );
      setCartItems(response.data.items);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (_id) => {
    try {
      const response = await axios.delete(
        `https://online-pharmacy-backend.onrender.com/cart/${_id}`,
        {
          headers: { token },
        }
      );
      setCartItems(response.data.items);
      fetchCart()

    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const updateCartItem = async (_id, newQuantity) => {
    try {
      const response = await axios.put(
        `https://online-pharmacy-backend.onrender.com/cart/${_id}`,
        {
          quantity: newQuantity,
        },
        { headers: { token } }
      );
      setCartItems(response.data.items);
      fetchCart()
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        updateCartItem,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

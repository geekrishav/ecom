import React,{useState,useContext,createContext, useEffect} from 'react'

const CartContext=createContext()

const CartProvider=({children})=>{

    const [cart,setCart] = useState([])

//     Based on the provided code for the useCart hook, it seems that the initial state of cart is set to an empty array [], which is correct and should not cause the "Uncaught TypeError: cart?.map is not a function" error.
// However, there is a potential issue with how the localStorage data is being handled. In the useEffect hook, you're attempting to retrieve the cart data from localStorage using localStorage.getItem('cart'). If there is no data stored in localStorage for the key 'cart', this will return null.
// Then, you're assigning the value returned from localStorage.getItem('cart') to the cart state using setCart(existingCartItem). If existingCartItem is null, this would cause the cart state to become null, which would then lead to the "Uncaught TypeError: cart?.map is not a function" error when trying to map over cart.
// To fix this issue, you can modify the useEffect hook to handle the case where existingCartItem is null or an empty string, and set the cart state to an empty array 
    useEffect(() => {
      const existingCartItem = localStorage.getItem('cart');
      if (existingCartItem) {
        try {
          const parsedCartItem = JSON.parse(existingCartItem);
          if (Array.isArray(parsedCartItem)) {
            setCart(parsedCartItem);
          } else {
            setCart([]);
          }
        } catch (error) {
          console.error('Error parsing cart data from localStorage:', error);
          setCart([]);
        }
      } else {
        setCart([]);
      }
    }, []);

    return (
        <CartContext.Provider value={{cart,setCart}}>
          {children}
        </CartContext.Provider>
    )
} 

const useCart=()=> useContext(CartContext)

export {useCart,CartProvider}

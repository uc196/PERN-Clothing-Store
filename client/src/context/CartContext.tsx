import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

import type { CartItem, Product } from "../types"

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
  deliveryFee: number
  finalTotal: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  cartPulse: boolean
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem("cart")
    return stored ? JSON.parse(stored) : []
  })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartPulse, setCartPulse] = useState(false)

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const triggerPulse = () => {
    setCartPulse(true)
    setTimeout(() => setCartPulse(false), 350)
  }

  const addToCart = (product: Product) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.product._id === product._id)

      if (exists) {
        return prev.map((i) =>
          i.product._id === product._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }

      return [...prev, { product, quantity: 1 }]
    })

    setIsCartOpen(true)
    triggerPulse()
  }

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product._id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => i.product._id !== productId)
      }

      return prev.map((i) =>
        i.product._id === productId ? { ...i, quantity } : i
      )
    })
  }

  const clearCart = () => setItems([])

  const cartCount = items.reduce((a, b) => a + b.quantity, 0)
  const cartTotal = items.reduce((a, b) => a + b.product.price * b.quantity, 0)
  const deliveryFee = cartTotal > 0 ? 1500 : 0
  const finalTotal = cartTotal + deliveryFee

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        deliveryFee,
        finalTotal,
        isCartOpen,
        setIsCartOpen,
        cartPulse,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react"

const CartSider = () => {
  const currency = "₦"
  const navigate = useNavigate()

  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    deliveryFee,
    finalTotal,
    cartPulse,
  } = useCart()

  if (!isCartOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50 z-40"
        onClick={() => setIsCartOpen(false)}
      />

      <aside className="absolute right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl flex flex-col overflow-hidden">
        <div
          className={`flex items-center justify-between p-4 border-b transition ${
            cartPulse ? "scale-105" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag />
            <h2 className="font-semibold">Your Cart</h2>
          </div>

          <button onClick={() => setIsCartOpen(false)}>
            <X />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">Cart is empty</p>
          ) : (
            items.map((item) => (
              <div key={item.product._id} className="flex gap-3 border-b pb-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />

                <div className="flex-1">
                  <p className="text-sm font-medium">{item.product.name}</p>
                  <p className="text-xs text-gray-500">
                    {currency}
                    {item.product.price}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity - 1)
                      }
                      className="p-1 border rounded"
                    >
                      <Minus size={14} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity + 1)
                      }
                      className="p-1 border rounded"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t p-4 space-y-2 bg-white">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>
              {currency}
              {cartTotal}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Delivery</span>
            <span>
              {currency}
              {deliveryFee}
            </span>
          </div>

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>
              {currency}
              {finalTotal}
            </span>
          </div>

          <button
            onClick={() => {
              setIsCartOpen(false)
              navigate("/checkout")
            }}
            className="w-full bg-black text-white py-3 rounded-lg"
          >
            Checkout
          </button>
        </div>
      </aside>
    </div>
  )
}

export default CartSider
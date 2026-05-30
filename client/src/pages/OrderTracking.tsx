import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Bike, Package, Phone, MapPin, CreditCard } from "lucide-react"
import { fakeOrders } from "./Myorders"

const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "₦"

const statusConfig: Record<string, { color: string; bg: string }> = {
  Placed:             { color: "text-yellow-700", bg: "bg-yellow-50" },
  Confirmed:          { color: "text-blue-700",   bg: "bg-blue-50" },
  Assigned:           { color: "text-indigo-700", bg: "bg-indigo-50" },
  Packed:             { color: "text-purple-700", bg: "bg-purple-50" },
  "Out for Delivery": { color: "text-orange-700", bg: "bg-orange-50" },
  Delivered:          { color: "text-green-700",  bg: "bg-green-50" },
  Cancelled:          { color: "text-red-700",    bg: "bg-red-50" },
}

type OrderType = typeof fakeOrders[0]

const OrderTracking = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState<OrderType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      const found = fakeOrders.find((o) => o._id === id) || null
      setOrder(found)
      setLoading(false)
    }, 800)
  }, [id])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-2xl" />
        ))}
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500">Order not found</p>
        <button onClick={() => navigate("/orders")} className="bg-black text-white px-6 py-2 rounded-xl">
          Back to Orders
        </button>
      </div>
    )
  }

  const badge = statusConfig[order.status] || statusConfig.Placed

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition">
          <ArrowLeft size={16} /> Back to Orders
        </button>

        {/* HEADER */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-lg font-bold">Order {order._id}</h1>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badge.bg} ${badge.color}`}>
              {order.status}
            </span>
          </div>
          <p className="text-xs text-gray-400">{order.createdAt} · {order.items.length} item(s)</p>
        </div>

        {/* TIMELINE */}

        {/* DELIVERY PARTNER */}
        {order.deliveryPartner && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bike size={16} className="text-amber-600" />
              <h2 className="font-semibold">Delivery Partner</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-lg">
                {order.deliveryPartner.avatar}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{order.deliveryPartner.name}</p>
                <p className="text-xs text-gray-400">{order.deliveryPartner.vehicle}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="text-xs font-medium">{order.deliveryPartner.rating}</span>
                </div>
              </div>
              
              <a  href={`tel:${order.deliveryPartner.phone}`}
                className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-700 transition"
              >
                <Phone size={14} />
                Call
              </a>
            </div>
          </div>
        )}

        {/* ITEMS */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package size={16} className="text-amber-600" />
            <h2 className="font-semibold">Order Items</h2>
          </div>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">{currency}{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-1">
            <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>{currency}{order.subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm text-gray-500"><span>Delivery</span><span>{currency}{order.deliveryFee.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm text-gray-500"><span>Tax</span><span>{currency}{order.tax.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-100"><span>Total</span><span>{currency}{order.total.toLocaleString()}</span></div>
          </div>
        </div>

        {/* SHIPPING + PAYMENT */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={14} className="text-amber-600" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Shipping</p>
            </div>
            <p className="text-sm text-gray-700">{order.shippingAddress.street}, {order.shippingAddress.city}</p>
            <p className="text-xs text-gray-400">{order.shippingAddress.state}, {order.shippingAddress.country}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard size={14} className="text-amber-600" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Payment</p>
            </div>
            <p className="text-sm text-gray-700">{order.paymentMethod}</p>
            <span className={`text-xs font-semibold ${order.isPaid ? "text-green-600" : "text-red-500"}`}>
              {order.isPaid ? "Paid" : "Unpaid"}
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default OrderTracking
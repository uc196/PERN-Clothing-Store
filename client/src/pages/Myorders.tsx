import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Package, ChevronDown, ChevronUp, MapPin, CreditCard, Clock } from "lucide-react"

const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "₦"

export const fakeOrders = [
  {
    _id: "ORD-001",
    items: [
      { name: "Men's Classic Shirt", image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg", quantity: 2, price: 4500 },
      { name: "Women's Floral Dress", image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg", quantity: 1, price: 7200 },
    ],
    shippingAddress: { street: "12 Broad Street", city: "Lagos", state: "Lagos", country: "Nigeria", lat: 6.4550, lng: 3.3841 },
    paymentMethod: "Card",
    subtotal: 16200, deliveryFee: 800, tax: 324, total: 17324,
    status: "Delivered",
    statusHistory: [
      { status: "Placed",           timestamp: "2024-12-01T10:00:00", note: "Your order has been received" },
      { status: "Confirmed",        timestamp: "2024-12-01T11:30:00", note: "Order confirmed by store" },
      { status: "Assigned",         timestamp: "2024-12-02T08:00:00", note: "Delivery partner assigned" },
      { status: "Packed",           timestamp: "2024-12-02T08:30:00", note: "Order packed and ready" },
      { status: "Out for Delivery", timestamp: "2024-12-02T09:00:00", note: "Order picked up by delivery partner" },
      { status: "Delivered",        timestamp: "2024-12-03T14:20:00", note: "Order delivered successfully" },
    ],
    deliveryPartner: { name: "Emeka Okafor", phone: "+234 801 234 5678", vehicle: "Honda Dispatch Bike", rating: 4.8, avatar: "EO" },
    deliveryOtp: "1234", isPaid: true, createdAt: "2024-12-01",
  },
  {
    _id: "ORD-002",
    items: [
      { name: "Slim Fit Chinos", image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg", quantity: 1, price: 5800 },
    ],
    shippingAddress: { street: "45 Victoria Island", city: "Lagos", state: "Lagos", country: "Nigeria", lat: 6.4281, lng: 3.4219 },
    paymentMethod: "Cash on Delivery",
    subtotal: 5800, deliveryFee: 500, tax: 116, total: 6416,
    status: "Out for Delivery",
    statusHistory: [
      { status: "Placed",           timestamp: "2024-12-05T08:00:00", note: "Your order has been received" },
      { status: "Confirmed",        timestamp: "2024-12-05T09:00:00", note: "Order confirmed by store" },
      { status: "Assigned",         timestamp: "2024-12-05T10:00:00", note: "Delivery partner assigned" },
      { status: "Packed",           timestamp: "2024-12-05T11:00:00", note: "Order packed and ready" },
      { status: "Out for Delivery", timestamp: "2024-12-06T08:30:00", note: "Order picked up by delivery partner" },
    ],
    deliveryPartner: { name: "Emeka Okafor", phone: "+234 801 234 5678", vehicle: "Honda Dispatch Bike", rating: 4.8, avatar: "EO" },
    deliveryOtp: "4821", isPaid: false, createdAt: "2024-12-05",
  },
  {
    _id: "ORD-003",
    items: [
      { name: "Women's Casual Top", image: "https://fakestoreapi.com/img/71HblAHs1xL._AC_UY879_-2.jpg", quantity: 3, price: 3200 },
      { name: "Men's Joggers",      image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",    quantity: 1, price: 4100 },
    ],
    shippingAddress: { street: "8 Allen Avenue", city: "Ikeja", state: "Lagos", country: "Nigeria", lat: 6.6018, lng: 3.3515 },
    paymentMethod: "Card",
    subtotal: 13700, deliveryFee: 800, tax: 274, total: 14774,
    status: "Packed",
    statusHistory: [
      { status: "Placed",    timestamp: "2024-12-08T14:00:00", note: "Your order has been received" },
      { status: "Confirmed", timestamp: "2024-12-08T15:00:00", note: "Order confirmed by store" },
      { status: "Assigned",  timestamp: "2024-12-08T15:30:00", note: "Delivery partner assigned" },
      { status: "Packed",    timestamp: "2024-12-08T16:00:00", note: "Order packed and ready" },
    ],
    deliveryPartner: null, deliveryOtp: "7732", isPaid: true, createdAt: "2024-12-08",
  },
  {
    _id: "ORD-004",
    items: [
      { name: "Leather Handbag", image: "https://fakestoreapi.com/img/81fAZal24fL._AC_UY879_.jpg", quantity: 1, price: 12000 },
    ],
    shippingAddress: { street: "22 Lekki Phase 1", city: "Lagos", state: "Lagos", country: "Nigeria", lat: 6.4698, lng: 3.5852 },
    paymentMethod: "Card",
    subtotal: 12000, deliveryFee: 1000, tax: 240, total: 13240,
    status: "Placed",
    statusHistory: [
      { status: "Placed", timestamp: "2024-12-09T09:00:00", note: "Your order has been received" },
    ],
    deliveryPartner: null, deliveryOtp: "9910", isPaid: false, createdAt: "2024-12-09",
  },
]

const statusConfig: Record<string, { color: string; bg: string; dot: string }> = {
  Placed:           { color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200",  dot: "bg-yellow-400" },
  Confirmed:        { color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",      dot: "bg-blue-400" },
  Assigned:         { color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200",  dot: "bg-indigo-400" },
  Packed:           { color: "text-purple-700", bg: "bg-purple-50 border-purple-200",  dot: "bg-purple-400" },
  "Out for Delivery": { color: "text-orange-700", bg: "bg-orange-50 border-orange-200", dot: "bg-orange-400" },
  Delivered:        { color: "text-green-700",  bg: "bg-green-50 border-green-200",    dot: "bg-green-400" },
  Cancelled:        { color: "text-red-700",    bg: "bg-red-50 border-red-200",        dot: "bg-red-400" },
}

const OrderCard = ({ order }: { order: typeof fakeOrders[0] }) => {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()
  const config = statusConfig[order.status] || statusConfig.Placed

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

      <div onClick={() => setExpanded(!expanded)} className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
            <Package size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-sm">{order._id}</p>
            <p className="text-xs text-gray-400">{order.createdAt} · {order.items.length} item(s)</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${config.bg} ${config.color}`}>
            {order.status}
          </span>
          <span className="font-bold text-sm">{currency}{order.total.toLocaleString()}</span>
          {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4 space-y-5">

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Items</p>
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
          </div>

          <div className="bg-gray-50 rounded-xl p-3 space-y-1">
            <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>{currency}{order.subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm text-gray-500"><span>Delivery</span><span>{currency}{order.deliveryFee.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm text-gray-500"><span>Tax</span><span>{currency}{order.tax.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2 mt-1"><span>Total</span><span>{currency}{order.total.toLocaleString()}</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={14} className="text-amber-600" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Shipping</p>
              </div>
              <p className="text-sm text-gray-700">{order.shippingAddress.street}, {order.shippingAddress.city}</p>
              <p className="text-xs text-gray-400">{order.shippingAddress.state}, {order.shippingAddress.country}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard size={14} className="text-amber-600" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Payment</p>
              </div>
              <p className="text-sm text-gray-700">{order.paymentMethod}</p>
              <span className={`text-xs font-semibold ${order.isPaid ? "text-green-600" : "text-red-500"}`}>
                {order.isPaid ? "Paid" : "Unpaid"}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} className="text-amber-600" />
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Status Timeline</p>
            </div>
            <div className="relative pl-4">
              {order.statusHistory.map((s, i) => {
                const c = statusConfig[s.status] || statusConfig.Placed
                return (
                  <div key={i} className="relative mb-4 last:mb-0 pl-5">
                    {i < order.statusHistory.length - 1 && (
                      <div className="absolute left-[5px] top-4 w-px h-full bg-gray-200" />
                    )}
                    <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-white ${c.dot}`} />
                    <p className="text-sm font-semibold">{s.status}</p>
                    <p className="text-xs text-gray-400">{new Date(s.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.note}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <button
            onClick={() => navigate(`/orders/${order._id}`)}
            className="w-full py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:bg-amber-600 active:scale-95 transition"
          >
            Track Order
          </button>

        </div>
      )}
    </div>
  )
}

const Myorders = () => {
  const [activeStatus, setActiveStatus] = useState("All")
  const statuses = ["All", "Placed", "Confirmed", "Assigned", "Packed", "Out for Delivery", "Delivered", "Cancelled"]

  const filtered = activeStatus === "All"
    ? fakeOrders
    : fakeOrders.filter((o) => o.status === activeStatus)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition border ${
                activeStatus === s
                  ? "bg-amber-600 text-white border-amber-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-amber-600 hover:text-amber-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Package size={40} className="mb-3 text-gray-300" />
            <p className="font-semibold">No {activeStatus} orders</p>
            <p className="text-sm mt-1">Your orders will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Myorders
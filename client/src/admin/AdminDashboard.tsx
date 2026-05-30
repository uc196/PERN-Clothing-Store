import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  PackageIcon,
  UsersIcon,
  ShoppingBagIcon,
  AlertTriangleIcon,
} from "lucide-react"

interface Stats {
  totalOrders: number
  totalUsers: number
  totalProducts: number
  outOfStock: number
  recentOrders: any[]
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
}

export default function AdminDashboard() {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "₦"
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      setStats({
        totalOrders: 24,
        totalUsers: 120,
        totalProducts: 56,
        outOfStock: 4,
        recentOrders: [
          {
            _id: "ORD123456",
            user: { name: "John Doe", email: "john@email.com" },
            items: [{}, {}, {}],
            total: 15000,
            status: "pending",
            createdAt: new Date().toISOString(),
          },
        ],
      })
    }

    fetchStats()
  }, [])

  if (!stats) return <div className="p-6 text-center text-gray-500">Loading dashboard...</div>

  const cards = [
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBagIcon },
    { label: "Total Users", value: stats.totalUsers, icon: UsersIcon },
    { label: "Total Products", value: stats.totalProducts, icon: PackageIcon },
    { label: "Out of Stock", value: stats.outOfStock, icon: AlertTriangleIcon },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl p-5 border flex justify-between"
          >
            <div>
              <p className="text-2xl font-semibold">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
              <card.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="px-6 py-5 border-b flex justify-between">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-orange-600">
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No orders yet
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order: any) => (
                  <tr key={order._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-xs">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{order.user?.name}</p>
                      <p className="text-xs text-gray-500">{order.user?.email}</p>
                    </td>
                    <td className="px-6 py-4">{order.items?.length || 0} items</td>
                    <td className="px-6 py-4 font-medium">
                      {currency}
                      {order.total}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          statusColors[order.status] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
import { useEffect, useState } from "react"
import { PackageIcon, NavigationIcon } from "lucide-react"

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState<any[]>([])
  const [tab, setTab] = useState<"active" | "completed">("active")
  const [tracking, setTracking] = useState(false)

  // OTP modal
  const [otpModal, setOtpModal] = useState<string | null>(null)
  const [otp, setOtp] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Cancel modal
  const [cancelModal, setCancelModal] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState("")

  useEffect(() => {
    setOrders([])
  }, [tab])

  const handleUpdateStatus = async (orderId: string, status: string) => {
    console.log(orderId, status)
  }

  const handleComplete = async () => {
    if (!otpModal || !otp) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setOtpModal(null)
      setOtp("")
    }, 1000)
  }

  const handleCancel = async () => {
    if (!cancelModal) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setCancelModal(null)
      setCancelReason("")
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Tabs + Tracking toggle */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["active", "completed"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
              tab === t ? "bg-app-green text-white" : "bg-white text-zinc-600 hover:bg-app-cream border border-app-border"
            }`}
          >
            {t === "active" ? "Active" : "Completed"}
          </button>
        ))}
        <div className="ml-auto">
          <button
            onClick={() => setTracking((prev) => !prev)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5 ${
              tracking ? "bg-green-600 text-white" : "bg-white text-zinc-600 border border-app-border hover:bg-app-cream"
            }`}
          >
            <NavigationIcon className={`w-3.5 h-3.5 ${tracking ? "animate-pulse" : ""}`} />
            {tracking ? "Sharing Location" : "Share Location"}
          </button>
        </div>
      </div>

      {/* Orders */}
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-app-border">
          <PackageIcon className="size-12 text-app-border mx-auto mb-3" />
          <p className="text-lg font-semibold text-zinc-900 mb-1">No {tab} deliveries</p>
          <p className="text-sm text-zinc-500">
            {tab === "active" ? "You'll see new assignments here" : "Completed deliveries will appear here"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order._id} className="p-4 bg-white rounded-xl border border-app-border">
              <p className="font-semibold">#{order._id.slice(-6)}</p>
              <p className="text-sm text-zinc-500">{order.status}</p>
            </div>
          ))}
        </div>
      )}

      {/* OTP Modal placeholder */}
      {otpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Enter OTP</h3>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border mb-4"
              placeholder="Enter OTP"
            />
            <div className="flex gap-2">
              <button onClick={() => setOtpModal(null)} className="flex-1 py-2 bg-zinc-100 rounded-lg">
                Cancel
              </button>
              <button
                onClick={handleComplete}
                disabled={submitting}
                className="flex-1 py-2 bg-app-green text-white rounded-lg disabled:opacity-50"
              >
                {submitting ? "Verifying..." : "Complete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal placeholder */}
      {cancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Cancel Delivery</h3>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border mb-4"
              placeholder="Reason for cancellation"
              rows={3}
            />
            <div className="flex gap-2">
              <button onClick={() => setCancelModal(null)} className="flex-1 py-2 bg-zinc-100 rounded-lg">
                Cancel
              </button>
              <button
                onClick={handleCancel}
                disabled={submitting}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50"
              >
                {submitting ? "Cancelling..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useShopContext } from "./AppLayout"
import { useCart } from "../context/CartContext"
import { ShoppingCart, Zap } from "lucide-react"

const useCountdown = () => {
  const getTimeLeft = () => {
    const now = new Date()
    const midnight = new Date()
    midnight.setHours(24, 0, 0, 0)
    const diff = midnight.getTime() - now.getTime()
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    }
  }

  const [timeLeft, setTimeLeft] = useState(getTimeLeft())
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])
  return timeLeft
}

const TimeBox = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center bg-white/10 rounded-xl px-4 py-2 min-w-[64px]">
    <span className="text-3xl font-bold text-white tabular-nums">{String(value).padStart(2, "0")}</span>
    <span className="text-xs text-white/60 uppercase tracking-widest">{label}</span>
  </div>
)

const FlashDeals = () => {
  const { products, loading } = useShopContext()
  const { addToCart } = useCart()
  const { hours, minutes, seconds } = useCountdown()
  const navigate = useNavigate()

  const deals = products.slice(0, 12)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* BANNER */}
      <div className="bg-amber-600 px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={28} className="text-yellow-400 fill-yellow-400" />
              <h1 className="text-4xl font-extrabold text-white tracking-tight">Flash Deals</h1>
            </div>
            <p className="text-white/80 text-sm">Limited time offers — grab them before they're gone!</p>
          </div>
          <div>
            <p className="text-white/60 text-xs uppercase tracking-widest mb-2 text-center">Ends in</p>
            <div className="flex items-center gap-2">
              <TimeBox value={hours} label="hrs" />
              <span className="text-white text-2xl font-bold mb-3">:</span>
              <TimeBox value={minutes} label="min" />
              <span className="text-white text-2xl font-bold mb-3">:</span>
              <TimeBox value={seconds} label="sec" />
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="max-w-7xl mx-auto px-5 py-8">
        <p className="text-gray-500 text-sm mb-5">
          Showing <span className="font-semibold text-black">{deals.length}</span> deals today
        </p>

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-52 bg-gray-200 animate-pulse rounded-xl" />
            ))}
          </div>
        )}

      {!loading && (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
    {deals.map((p) => {
      // Fallback securely between id variations 👇
      const dealId = p.id || p._id;
      
      return (
        <div
          key={dealId}
          onClick={() => navigate(`/products/${dealId}`)}
          className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:border-black transition-all duration-300 cursor-pointer"
        >
          {/* ... keeping layout inner blocks identical ... */}
        </div>
      );
    })}
  </div>
)}
      </div>
    </div>
  )
}

export default FlashDeals
import { useEffect, useState } from "react"
import {
  Truck,
  CreditCard,
  ShieldCheck,
  BadgePercent,
} from "lucide-react"

const features = [
  {
    icon: <Truck size={28} />,
    title: "Free Delivery",
    desc: "Orders above ₦20,000 qualify for free delivery anywhere in Lagos.",
  },
  {
    icon: <CreditCard size={28} />,
    title: "Pay on Delivery",
    desc: "Shop confidently and pay only when your order arrives at your door.",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Secure Payments",
    desc: "Your transactions are fully protected with encrypted systems.",
  },
  {
    icon: <BadgePercent size={28} />,
    title: "Hot Discounts",
    desc: "Enjoy daily deals and seasonal discounts on fashion items.",
  },
]

const Features = () => {
  const [index, setIndex] = useState(0)

  // AUTO SLIDE (mobile only UX)
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % features.length)
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full px-4 md:px-10 mt-12">

      {/* DESKTOP GRID */}
      <div className="hidden md:grid grid-cols-4 gap-6">
        {features.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition border border-gray-100"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-950 text-white mb-4">
              {item.icon}
            </div>

            <h3 className="font-semibold text-lg mb-2 text-gray-800">
              {item.title}
            </h3>

            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* MOBILE SLIDER */}
      <div className="md:hidden overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {features.map((item, i) => (
            <div key={i} className="min-w-full px-2">
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">

                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-950 text-white mb-4">
                  {item.icon}
                </div>

                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* DOT INDICATORS */}
        <div className="flex justify-center gap-2 mt-4">
          {features.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === index ? "bg-green-900 w-4" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

    </div>
  )
}

export default Features
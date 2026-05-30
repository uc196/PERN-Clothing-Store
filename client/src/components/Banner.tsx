import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const banners = [
  { text: "🔥 20% OFF FIRST ORDER", color: "bg-green-950" },
  { text: "🚚 Free delivery above ₦20,000", color: "bg-green-900" },
  { text: "💥 Flash Sale today only", color: "bg-green-950" },
]

const Banner = () => {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)

  // rotate banner text
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!visible) return null

  return (
    <div
      className={`sticky top-0 z-50 w-full text-white transition-all duration-300
      ${scrolled ? "shadow-xl" : "shadow-none"}
      ${banners[index].color}`}
    >

      {/* CLOSE BUTTON */}
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2
        w-8 h-8 rounded-full bg-white/10 hover:bg-white/20
        flex items-center justify-center text-white font-bold"
      >
        ×
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="p-3 flex items-center justify-center"
        >
          <p className="text-sm md:text-base font-medium text-center pr-10">
            {banners[index].text}
          </p>
        </motion.div>
      </AnimatePresence>

    </div>
  )
}

export default Banner
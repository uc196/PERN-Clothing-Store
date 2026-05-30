import { useState } from "react"
import { Mail, Lock, User, Loader2Icon } from "lucide-react"

const Login = () => {

  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      window.location.href = "/"
    }, 2000)
  }

  return (
    <div className="min-h-screen flex">

      {/* Left Side */}
      <div className="hidden md:flex w-1/2 relative">

        {/* Background Image */}
        <img
          src="src/assets/loginbackground.webp"
          alt="fashion"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Text */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 text-white w-full">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to Insta
          </h1>

          <p className="text-lg max-w-md leading-relaxed">
            Get and buy all your wears for both male and female
            with the best fashion styles and quality products.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 px-6 py-10">

        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {isLogin ? "Login" : "Register"}
            </h2>

            <p className="text-gray-500 mt-2">
              {isLogin
                ? "Sign in to continue shopping"
                : "Create your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Remember */}
            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" />
                  Remember me
                </label>

                <a
                  href="#"
                  className="text-black font-medium hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading
                ? <Loader2Icon className="animate-spin mx-auto" />
                : isLogin
                ? "Login"
                : "Register"}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-gray-600 mt-6">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 font-semibold text-black hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login
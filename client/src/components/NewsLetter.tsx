const NewsLetter = () => {
  return (
    <div className="w-full px-5 md:px-10 pt-10 flex items-center justify-center">

      <div className="w-full max-w-8xl bg-white text-gray-800 rounded-3xl shadow-xl p-10 md:p-16 text-center relative overflow-hidden border border-gray-100">

        {/* FLOATING BADGE */}
        <div className="absolute top-5 left-5 bg-green-950 text-white font-bold px-4 py-2 rounded-full shadow-md text-sm animate-bounce">
          10% OFF
        </div>

        {/* TITLE */}
        <h2 className="text-3xl md:text-4xl font-bold">
          Subscribe to our Newsletter
        </h2>

        {/* DESCRIPTION */}
        <p className="text-green-950 text-sm md:text-base mt-4 max-w-3xl mx-auto">
          Get updates on new arrivals, exclusive deals, limited offers, and special discounts directly in your inbox.
        </p>

        {/* INPUT SECTION */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">

          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full px-5 py-4 rounded-full border border-gray-200 text-green-950 outline-none focus:border-black transition"
          />

          <button className="bg-green-950 text-white font-semibold px-8 py-4 rounded-full hover:bg-gray-800 transition whitespace-nowrap">
            Subscribe
          </button>

        </div>

        {/* SMALL TEXT */}
        <p className="text-xs text-gray-400 mt-6">
          We respect your privacy. No spam ever.
        </p>

      </div>

    </div>
  )
}

export default NewsLetter
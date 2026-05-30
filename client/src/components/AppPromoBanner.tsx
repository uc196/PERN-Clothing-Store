const AppPromoBanner = () => {
  return (
    <div className="w-full px-5 md:px-10 pt-6">

      <div className="relative overflow-hidden rounded-3xl shadow-lg">

        {/* IMAGE */}
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80"
          alt="Shoe Banner"
          className="w-full h-[300px] md:h-[420px] object-cover"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* CONTENT */}
        <div className="absolute inset-0 flex items-center">

          <div className="text-white max-w-md ml-6 md:ml-14 flex flex-col gap-4">

            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Elevate Your Style
            </h2>

            <p className="text-sm md:text-base text-gray-200">
              Premium sneakers built for comfort, performance, and street fashion.
              Step into confidence with every step.
            </p>

            <button className="bg-white text-black px-6 py-2 rounded-full w-fit font-semibold hover:bg-gray-200 transition">
              Shop Now
            </button>

          </div>

        </div>

      </div>
    </div>
  )
}

export default AppPromoBanner
const CollectionBanner = ({ title, description, image }) => {
  return (
   <section className="relative w-full h-[400px] overflow-hidden">

      {/* Background Image */}
      <img
        src={image}
        alt={title}
          className="w-full h-full object-cover object-[center_20%]"
      />

      {/* Light Overlay */}
      <div className="absolute inset-0 bg-white/50"></div>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {title}
        </h1>

        <p className="mt-2 max-w-xl text-xs md:text-sm text-gray-600 leading-relaxed">
          {description}
        </p>

      </div>
    </section>
  );
};

export default CollectionBanner;
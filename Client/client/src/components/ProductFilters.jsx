const ProductFilters = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    
    <aside className="w-full shrink-0 border-b border-gray-200 pb-5 lg:w-[260px] lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
      <h2 className="mb-4 text-lg font-semibold lg:mb-8 lg:text-2xl">
        Filters
      </h2>

      <div>
        <h3 className="mb-3 text-xs font-semibold tracking-widest text-gray-500 lg:mb-4 lg:text-sm">
          CATEGORY
        </h3>

       
        <div className="flex flex-wrap gap-x-5 gap-y-3 lg:flex-col lg:gap-4">
          {categories.map((category) => (
            <label
              key={category}
              className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 lg:gap-3 lg:text-base"
            >
              <input
                type="radio"
                name="category"
                checked={selectedCategory === category}
                onChange={() => setSelectedCategory(category)}
                className="h-4 w-4 cursor-pointer"
              />

              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ProductFilters;
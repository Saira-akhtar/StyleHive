const ProductFilters = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <aside className="w-[260px] shrink-0 border-r border-gray-200 pr-8">
      <h2 className="mb-8 text-2xl font-semibold">
        Filters
      </h2>

      <div>
        <h3 className="mb-4 text-sm font-semibold tracking-widest text-gray-500">
          CATEGORY
        </h3>

        <div className="flex flex-col gap-4">
          {categories.map((category) => (
            <label
              key={category}
              className="flex cursor-pointer items-center gap-3 text-gray-700"
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
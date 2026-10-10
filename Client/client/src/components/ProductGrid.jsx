import ProductCard from "./ProductCard";

const ProductGrid = ({ products = [], total = 0 }) => {
  return (
    // min-w-0 lets the grid shrink inside a flex row instead of overflowing
    <div className="w-full min-w-0">
      <div className="flex items-center justify-between mb-5 md:mb-7">
        <p className="text-sm text-gray-600">
          {total} {total === 1 ? "product" : "products"}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="py-16 md:py-24 text-center">
          <p className="text-gray-500 text-sm">No products found.</p>
        </div>
      ) : (
        // Phone: 2 cols with a tight gap. Tablet: 3. Desktop: 4.
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 md:gap-x-5 gap-y-8 md:gap-y-12">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              image={product.images?.[0]}
              brand={product.brand}
              name={product.name}
              price={product.price}
              stock={product.stock}
              variants={product.variants}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
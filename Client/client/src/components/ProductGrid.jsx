import ProductCard from "./ProductCard";

const ProductGrid = ({ products = [], total = 0 }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-7">
        <p className="text-sm text-gray-600">
          {total} {total === 1 ? "product" : "products"}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-gray-500 text-sm">
            No products found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-5 gap-y-12">
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
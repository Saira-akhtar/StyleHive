import CollectionBanner from "../components/CollectionBanner";
import ProductGrid from "../components/ProductGrid";
import { getProductsAPI } from "../Services/api.js";
import { useEffect, useState } from "react";

const Men = () => {
  const [menProducts, setMenProducts] = useState([]);

  useEffect(() => {
    const fetchMenProducts = async () => {
      try {
        const response = await getProductsAPI();

        const products = response.data.products || [];

        const filteredProducts = products.filter(
          (product) => product.category?.name === "Men",
        );

        setMenProducts(filteredProducts);
      } catch (error) {
        console.error(
          "Error fetching Men products:",
          error.response?.data || error.message,
        );
      }
    };

    fetchMenProducts();
  }, []);

  return (
    <div className="bg-white">
      {/* Collection Banner */}
      <CollectionBanner
        title="Men's Collection"
        description="Discover our curated selection of timeless tailoring, premium outerwear, and essential accessories for the modern gentleman."
        image="src/assets/men-banner.png"
      />

      {/* Products Section */}
      <section className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-14">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-3">
              Men's Collection
            </p>

            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-gray-900">
              Shop Men's Wear
            </h2>
          </div>
        </div>

        {/* Product Grid */}
        <div className="w-full">
          <ProductGrid products={menProducts} total={menProducts.length} />
        </div>
      </section>
    </div>
  );
};

export default Men;

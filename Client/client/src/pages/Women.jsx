import { useEffect, useState } from "react";
import CollectionBanner from "../components/CollectionBanner";
import ProductGrid from "../components/ProductGrid";
import { getProductsAPI } from "../Services/api.js";

const Women = () => {
  const [womenProducts, setWomenProducts] = useState([]);

  useEffect(() => {
    const fetchWomenProducts = async () => {
      try {
        const response = await getProductsAPI();

        const products = response.data.products || [];

        const filteredProducts = products.filter(
          (product) => product.category?.name === "Women"
        );

        setWomenProducts(filteredProducts);
      } catch (error) {
        console.error(
          "Error fetching Women products:",
          error.response?.data || error.message
        );
      }
    };

    fetchWomenProducts();
  }, []);

  return (
    <div className="bg-white">

      {/* ================================
          WOMEN COLLECTION BANNER
      ================================= */}

      <CollectionBanner
        title="Women's Collection"
        description="Explore refined silhouettes, luxe knits, and effortless separates designed for the modern woman."
        image="/women-banner.png"
      />

      {/* ================================
          PRODUCTS
      ================================= */}

      <section className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-3">
              Women's Collection
            </p>

            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-gray-900">
              Shop Women's Wear
            </h2>
          </div>
        </div>
        <ProductGrid
          products={womenProducts}
          total={womenProducts.length}
        />
      </section>

    </div>
  );
};

export default Women;
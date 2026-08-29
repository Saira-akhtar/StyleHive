import { useEffect, useState } from "react";
import CollectionBanner from "../components/CollectionBanner";
import ProductGrid from "../components/ProductGrid";
import { getProductsAPI } from "../Services/api.js";

const Kids = () => {
  const [kidsProducts, setKidsProducts] = useState([]);

  useEffect(() => {
    const fetchKidsProducts = async () => {
      try {
        const response = await getProductsAPI();

        const products = response.data.products || [];

        const filteredProducts = products.filter(
          (product) => product.category?.name === "Kids"
        );

        setKidsProducts(filteredProducts);
      } catch (error) {
        console.error(
          "Error fetching Kids products:",
          error.response?.data || error.message
        );
      }
    };

    fetchKidsProducts();
  }, []);

  return (
    <div className="bg-white">

      {/* =================================
          KIDS COLLECTION BANNER
      ================================== */}

      <CollectionBanner
        title="Kids' Collection"
        description="Playful, comfortable, and durable pieces made for everyday adventures — designed for kids of every age."
        image="src/assets/kids-banner.png"
      />
      

      {/* =================================
          PRODUCTS
      ================================== */}

      <section className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-3">
              Kid's Collection
            </p>

            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-gray-900">
              Shop Kid's Wear
            </h2>
          </div>
        </div>
        <ProductGrid
          products={kidsProducts}
          total={kidsProducts.length}
        />
      </section>

    </div>
  );
};

export default Kids;
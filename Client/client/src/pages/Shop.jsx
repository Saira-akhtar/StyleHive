import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CollectionBanner from "../components/CollectionBanner";
import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";
import { getProductsAPI } from "../Services/api";

const Shop = () => {
  // Search query Navbar se URL ke through milegi
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [loading, setLoading] = useState(true);

  // ===============================
  // FETCH PRODUCTS
  // ===============================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await getProductsAPI();

        console.log("Products:", response.data);

        setProducts(response.data.products || response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ===============================
  // CATEGORY + SEARCH FILTER
  // ===============================

  const filteredProducts = products.filter((product) => {
    // Category filter
    const matchesCategory =
      selectedCategory === "All Products" ||
      product.category?.name === selectedCategory;

    // Search filter
    const matchesSearch =
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return <div className="py-20 text-center">Loading products...</div>;
  }

  return (
    <div>
      {/* SHOP BANNER */}

      <CollectionBanner
        title="Shop All"
        description="Browse our complete collection — timeless essentials and seasonal favorites for everyone."
        image="/shop-banner.png"
      />

      {/* PRODUCTS */}

      <section className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:gap-8 lg:py-10">
        <ProductFilters
          categories={["All Products", "Men", "Women", "Kids"]}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <div className="min-w-0 flex-1">
          <ProductGrid
            products={filteredProducts}
            total={filteredProducts.length}
          />
        </div>
      </section>
    </div>
  );
};

export default Shop;

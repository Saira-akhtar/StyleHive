import { useState, useEffect } from "react";
import {
  getProductsAPI,
  addProductAPI,
  updateProductAPI,
  deleteProductAPI,
  getCategoriesAPI,
} from "../../Services/api.js";

const emptyVariant = () => ({
  size: "",
  color: "",
  stock: "",
});

const AdminProducts = () => {
  // ================================
  // STATES
  // ================================

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    brand: "",
    category: "",
    stock: "",
    rating: 0,
    images: [],
    variants: [emptyVariant()],
  });

  // ================================
  // DEFAULT CATEGORIES
  // ================================

  const defaultCategories = [];

  // ================================
  // FETCH PRODUCTS
  // ================================

  const getProducts = async () => {
    try {
      setLoading(true);

      const response = await getProductsAPI();

      setProducts(response.data.products || response.data || []);
    } catch (error) {
      console.error(
        "Error fetching products:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // FETCH CATEGORIES
  // ================================

  const getCategories = async () => {
    try {
      const response = await getCategoriesAPI();

      const fetchedCategories =
        response.data.categories || response.data || [];

      if (
        Array.isArray(fetchedCategories) &&
        fetchedCategories.length > 0
      ) {
        setCategories(fetchedCategories);
      } else {
        setCategories(defaultCategories);
      }
    } catch (error) {
      console.error(
        "Error fetching categories:",
        error.response?.data || error.message
      );

      setCategories(defaultCategories);
    }
  };

  // ================================
  // INITIAL LOAD
  // ================================

  useEffect(() => {
  const loadData = async () => {
    await Promise.all([
      getProducts(),
      getCategories(),
    ]);
  };

  loadData();
}, []);
  // ================================
  // NORMAL INPUT CHANGE
  // ================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================================
  // IMAGE CHANGE
  // ================================

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: Array.from(e.target.files),
    }));
  };

  // ================================
  // VARIANT CHANGE
  // ================================

  const handleVariantChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedVariants = [...prev.variants];

      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: value,
      };

      return {
        ...prev,
        variants: updatedVariants,
      };
    });
  };

  // ================================
  // ADD NEW VARIANT
  // ================================

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, emptyVariant()],
    }));
  };

  // ================================
  // REMOVE VARIANT
  // ================================

  const removeVariant = (index) => {
    setFormData((prev) => {
      const updatedVariants = prev.variants.filter(
        (_, variantIndex) => variantIndex !== index
      );

      return {
        ...prev,
        variants:
          updatedVariants.length > 0
            ? updatedVariants
            : [emptyVariant()],
      };
    });
  };

  // ================================
  // RESET FORM
  // ================================

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      brand: "",
      category: "",
      stock: "",
      rating: 0,
      images: [],
      variants: [emptyVariant()],
    });
  };

  // ================================
  // PREPARE VARIANTS
  // ================================

  const prepareVariants = () => {
    return formData.variants
      .filter(
        (variant) =>
          variant.size.trim() !== "" ||
          variant.color.trim() !== ""
      )
      .map((variant) => ({
        size: variant.size.trim(),
        color: variant.color.trim(),
        stock: Number(variant.stock) || 0,
      }));
  };

  // ================================
  // ADD PRODUCT
  // ================================

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("brand", formData.brand);
      data.append("category", formData.category);
      data.append("stock", formData.stock);
      data.append("rating", formData.rating);

      // IMPORTANT
      const variants = prepareVariants();

      data.append("variants", JSON.stringify(variants));

      // Images
      formData.images.forEach((image) => {
        data.append("images", image);
      });

      console.log("Adding product variants:", variants);

      await addProductAPI(data);

      alert("Product added successfully!");

      resetForm();
      setShowForm(false);

      getProducts();
    } catch (error) {
      console.error(
        "Error adding product:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to add product"
      );
    }
  };

  // ================================
  // EDIT PRODUCT
  // ================================

  const handleEdit = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      brand: product.brand || "",
      category: product.category?._id || product.category || "",
      stock: product.stock || "",
      rating: product.rating || 0,
      images: [],

      variants:
        product.variants && product.variants.length > 0
          ? product.variants.map((variant) => ({
              size: variant.size || "",
              color: variant.color || "",
              stock: variant.stock ?? "",
            }))
          : [emptyVariant()],
    });

    setShowForm(true);
  };

  // ================================
  // UPDATE PRODUCT
  // ================================

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("brand", formData.brand);
      data.append("category", formData.category);
      data.append("stock", formData.stock);
      data.append("rating", formData.rating);

      // IMPORTANT
      const variants = prepareVariants();

      data.append("variants", JSON.stringify(variants));

      // Images
      formData.images.forEach((image) => {
        if (image instanceof File) {
          data.append("images", image);
        }
      });

      console.log("Updating product variants:", variants);

      await updateProductAPI(
        editingProduct._id,
        data
      );

      alert("Product updated successfully!");

      resetForm();
      setEditingProduct(null);
      setShowForm(false);

      getProducts();
    } catch (error) {
      console.error(
        "Error updating product:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update product"
      );
    }
  };

  // ================================
  // DELETE PRODUCT
  // ================================

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product?"
      )
    ) {
      return;
    }

    try {
      await deleteProductAPI(id);

      alert("Product deleted successfully!");

      getProducts();
    } catch (error) {
      console.error(
        "Error deleting product:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  // ================================
  // FORM SUBMIT
  // ================================

  const handleSubmit = (e) => {
    if (editingProduct) {
      handleUpdateProduct(e);
    } else {
      handleAddProduct(e);
    }
  };

  const activeCategories =
    categories.length > 0
      ? categories
      : defaultCategories;

  // ================================
  // UI
  // ================================

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Products
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Add, edit and manage your store products
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded font-medium"
        >
          + Add Product
        </button>
      </div>

      {/* ================================
          PRODUCT FORM
      ================================= */}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-200"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              {editingProduct
                ? "Edit Product"
                : "Add New Product"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Enter product information and variants.
            </p>
          </div>

          {/* BASIC INFORMATION */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* NAME */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Product Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-4 py-2.5"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>

              <textarea
                name="description"
                placeholder="Product Description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full border border-gray-300 rounded px-4 py-2.5"
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Price
              </label>

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full border border-gray-300 rounded px-4 py-2.5"
              />
            </div>

            {/* BRAND */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Brand
              </label>

              <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-4 py-2.5"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-4 py-2.5 bg-white"
              >
                <option value="">
                  Select Category
                </option>

                {activeCategories.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat._id}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* TOTAL STOCK */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Total Stock
              </label>

              <input
                type="number"
                name="stock"
                placeholder="Total Stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full border border-gray-300 rounded px-4 py-2.5"
              />
            </div>

            {/* RATING */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Rating
              </label>

              <input
                type="number"
                name="rating"
                placeholder="Rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                className="w-full border border-gray-300 rounded px-4 py-2.5"
              />
            </div>

            {/* IMAGES */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Product Images
              </label>

              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>

          </div>

          {/* ================================
              VARIANTS
          ================================= */}

          <div className="mt-8 border-t pt-6">

            <div className="flex justify-between items-center mb-4">

              <div>
                <h3 className="text-lg font-semibold">
                  Product Variants
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Add available size, color and stock.
                </p>
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded text-sm"
              >
                + Add Variant
              </button>

            </div>

            {/* VARIANT HEADINGS */}

            <div className="hidden md:grid grid-cols-12 gap-3 mb-2 text-sm font-medium text-gray-600">
              <div className="col-span-4">
                Size
              </div>

              <div className="col-span-4">
                Color
              </div>

              <div className="col-span-3">
                Variant Stock
              </div>

              <div className="col-span-1">
                Action
              </div>
            </div>

            {/* VARIANT ROWS */}

            <div className="space-y-3">

              {formData.variants.map(
                (variant, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center border border-gray-200 rounded-lg p-3 md:p-0 md:border-0"
                  >

                    {/* SIZE */}

                    <div className="md:col-span-4">
                      <label className="md:hidden block text-sm font-medium mb-1">
                        Size
                      </label>

                      <input
                        type="text"
                        placeholder="e.g. S, M, L, XL"
                        value={variant.size}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "size",
                            e.target.value
                          )
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>

                    {/* COLOR */}

                    <div className="md:col-span-4">
                      <label className="md:hidden block text-sm font-medium mb-1">
                        Color
                      </label>

                      <input
                        type="text"
                        placeholder="e.g. Black, White, Blue"
                        value={variant.color}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "color",
                            e.target.value
                          )
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>

                    {/* STOCK */}

                    <div className="md:col-span-3">
                      <label className="md:hidden block text-sm font-medium mb-1">
                        Variant Stock
                      </label>

                      <input
                        type="number"
                        min="0"
                        placeholder="Stock"
                        value={variant.stock}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "stock",
                            e.target.value
                          )
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>

                    {/* REMOVE */}

                    <div className="md:col-span-1 flex justify-end">

                      <button
                        type="button"
                        onClick={() =>
                          removeVariant(index)
                        }
                        disabled={
                          formData.variants.length === 1
                        }
                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:text-gray-300"
                      >
                        Remove
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>

          </div>

          {/* BUTTONS */}

          <div className="flex gap-3 mt-8 pt-6 border-t">

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded font-medium"
            >
              {editingProduct
                ? "Update Product"
                : "Save Product"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingProduct(null);
                resetForm();
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2.5 rounded font-medium"
            >
              Cancel
            </button>

          </div>

        </form>
      )}

      {/* ================================
          PRODUCT TABLE
      ================================= */}

      {loading ? (
        <p className="text-gray-500">
          Loading products...
        </p>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">

            <thead className="bg-gray-100 border-b">

              <tr>
                <th className="text-left p-3 font-semibold">
                  Image
                </th>

                <th className="text-left p-3 font-semibold">
                  Name
                </th>

                <th className="text-left p-3 font-semibold">
                  Brand
                </th>

                <th className="text-left p-3 font-semibold">
                  Category
                </th>

                <th className="text-left p-3 font-semibold">
                  Price
                </th>

                <th className="text-left p-3 font-semibold">
                  Stock
                </th>

                <th className="text-left p-3 font-semibold">
                  Variants
                </th>

                <th className="text-left p-3 font-semibold">
                  Actions
                </th>
              </tr>

            </thead>

            <tbody>

              {products.length === 0 ? (

                <tr>
                  <td
                    colSpan="8"
                    className="text-center p-6 text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>

              ) : (

                products.map((product) => (

                  <tr
                    key={product._id}
                    className="border-t hover:bg-gray-50"
                  >

                    {/* IMAGE */}

                    <td className="p-3">

                      <img
                        src={
                          product.images?.[0] ||
                          "https://via.placeholder.com/80"
                        }
                        alt={product.name}
                        className="w-12 h-14 object-cover rounded border"
                      />

                    </td>

                    {/* NAME */}

                    <td className="p-3 font-medium">
                      {product.name}
                    </td>

                    {/* BRAND */}

                    <td className="p-3 text-gray-600">
                      {product.brand}
                    </td>

                    {/* CATEGORY */}

                    <td className="p-3 text-gray-600">
                      {product.category?.name ||
                        product.category ||
                        "N/A"}
                    </td>

                    {/* PRICE */}

                    <td className="p-3">
                      ${product.price}
                    </td>

                    {/* STOCK */}

                    <td className="p-3">
                      {product.stock}
                    </td>

                    {/* VARIANTS */}

                    <td className="p-3">

                      {product.variants?.length > 0 ? (
                        <span className="text-green-600 text-sm">
                          {product.variants.length} variant
                          {product.variants.length > 1
                            ? "s"
                            : ""}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          No variants
                        </span>
                      )}

                    </td>

                    {/* ACTIONS */}

                    <td className="p-3">

                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            handleEdit(product)
                          }
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(product._id)
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))
              )}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
};

export default AdminProducts;
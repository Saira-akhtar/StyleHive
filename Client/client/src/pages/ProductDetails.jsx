import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductAPI, getAllReviewsAPI } from "../Services/api.js";
import API from "../Services/api.js";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const [cartMessage, setCartMessage] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  // =========================================================
  // FETCH PRODUCT + REVIEWS
  // =========================================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductAPI(id);

        setProduct(response.data.product);
      } catch (error) {
        console.error(
          "Error fetching product:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await getAllReviewsAPI(id);

        setReviews(response.data.reviews || []);
      } catch (error) {
        console.error(
          "Error fetching reviews:",
          error.response?.data || error.message,
        );

        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  // =========================================================
  // VARIANTS
  // =========================================================

  const hasVariants = product?.variants && product.variants.length > 0;

  const availableSizes = hasVariants
    ? [...new Set(product.variants.map((v) => v.size?.trim()).filter(Boolean))]
    : [];

  const availableColors = hasVariants
    ? [
        ...new Map(
          product.variants
            .filter((v) => v.color)
            .map((v) => {
              const originalColor = v.color.trim();

              return [originalColor.toLowerCase(), originalColor];
            }),
        ).values(),
      ]
    : [];

  // =========================================================
  // FIND SELECTED VARIANT
  // =========================================================

  const selectedVariant = hasVariants
    ? product.variants.find((v) => {
        const sizeMatches =
          availableSizes.length === 0 || v.size?.trim() === selectedSize;

        const colorMatches =
          availableColors.length === 0 ||
          v.color?.trim().toLowerCase() === selectedColor?.trim().toLowerCase();

        return sizeMatches && colorMatches;
      })
    : null;

  // =========================================================
  // EFFECTIVE STOCK
  // =========================================================

  const effectiveStock = hasVariants
    ? (selectedVariant?.stock ?? 0)
    : (product?.stock ?? 0);

  const variantSelectionComplete =
    !hasVariants ||
    ((availableSizes.length === 0 || selectedSize) &&
      (availableColors.length === 0 || selectedColor));

  // =========================================================
  // QUANTITY
  // =========================================================

  const increaseQuantity = () => {
    if (quantity < effectiveStock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = async () => {
    // Check login first
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      if (hasVariants && !variantSelectionComplete) {
        setCartMessage("Please select size and color.");
        return;
      }

      setAddingToCart(true);
      setCartMessage("");

      const user = JSON.parse(storedUser);

      // Check user ID
      if (!user?._id) {
        setCartMessage("User information not found. Please login again.");
        return;
      }

      // Add product to cart
      const response = await API.post("/cart/add-to-cart", {
        userId: user._id,
        productId: product._id,
        quantity: quantity,
        size: hasVariants ? selectedSize : null,
        color: hasVariants ? selectedColor : null,
      });

      console.log("Add to cart response:", response.data);

      setCartMessage("Product added to cart successfully!");
    } catch (error) {
      console.error(
        "Add to cart error:",
        error.response?.data || error.message,
      );

      setCartMessage(
        error.response?.data?.message || "Failed to add product to cart.",
      );
    } finally {
      setAddingToCart(false);
    }
  };

  // =========================================================
  // COLOR SWATCH HELPER
  // =========================================================

  const getColorValue = (color) => {
    const normalized = color?.trim().toLowerCase();

    const colorMap = {
      black: "#000000",
      white: "#ffffff",
      red: "#b91c1c",
      blue: "#1d4ed8",
      navy: "#172554",
      green: "#166534",
      olive: "#606c38",
      yellow: "#eab308",
      orange: "#ea580c",
      pink: "#f9a8d4",
      purple: "#7e22ce",
      brown: "#78350f",
      beige: "#d6c5a8",
      grey: "#9ca3af",
      gray: "#9ca3af",
      cream: "#f5f1df",
    };

    return colorMap[normalized] || "#d1d5db";
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-white">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Loading product...
        </p>
      </div>
    );
  }

  // =========================================================
  // PRODUCT NOT FOUND
  // =========================================================

  if (!product) {
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-white">
        <p className="text-sm text-gray-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 md:py-14 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[0.9fr_1fr] lg:gap-16">
          {/* PRODUCT IMAGE */}

          <div className="flex justify-center">
            <div className="w-full max-w-[500px] overflow-hidden bg-[#f5f5f3]">
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="
                  block
                  aspect-[4/5]
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  hover:scale-[1.02]
                "
              />
            </div>
          </div>

          {/* PRODUCT INFORMATION */}

          <div className="w-full max-w-[600px] lg:pt-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gray-500">
              {product.brand || "STYLEHIVE"}
            </p>

            <h1 className="mt-3 text-3xl font-medium tracking-[-0.02em] text-black sm:text-4xl">
              {product.name}
            </h1>

            <p className="mt-5 text-xl font-medium text-gray-900">
              PKR  {Number(product.price).toFixed(2)}
            </p>

            <div className="my-7 border-t border-gray-200" />

            {/* DESCRIPTION */}

            <div>
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black">
                Description
              </h2>

              <p className="mt-3 max-w-[560px] text-sm leading-7 text-gray-600">
                {product.description}
              </p>
            </div>

            {/* CATEGORY */}

            <div className="mt-6">
              <p className="text-sm text-gray-500">
                Category:{" "}
                <span className="font-medium text-black">
                  {product.category?.name || "N/A"}
                </span>
              </p>
            </div>

            {/* SIZE */}

            {availableSizes.length > 0 && (
              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black">
                    Size
                  </p>

                  <button
                    type="button"
                    className="text-[11px] text-gray-500 underline underline-offset-4 hover:text-black"
                  >
                    Size Guide
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const isSelected = selectedSize === size;

                    const sizeAvailable = product.variants.some(
                      (v) =>
                        v.size?.trim() === size &&
                        (availableColors.length === 0 ||
                          !selectedColor ||
                          v.color?.trim().toLowerCase() ===
                            selectedColor?.trim().toLowerCase()) &&
                        v.stock > 0,
                    );

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setSelectedSize(size);
                          setQuantity(1);
                          setCartMessage("");
                        }}
                        disabled={!sizeAvailable}
                        className={`
                          h-11
                          min-w-[50px]
                          border
                          px-4
                          text-sm
                          transition-all
                          duration-200

                          ${
                            isSelected
                              ? "border-black bg-black text-white"
                              : "border-gray-300 bg-white text-gray-800 hover:border-black"
                          }

                          ${
                            !sizeAvailable
                              ? "cursor-not-allowed opacity-30 line-through"
                              : ""
                          }
                        `}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* COLOR */}

            {availableColors.length > 0 && (
              <div className="mt-8">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-black">
                  Color
                </p>

                <div className="flex flex-wrap gap-5">
                  {availableColors.map((color) => {
                    const isSelected =
                      selectedColor?.toLowerCase() === color.toLowerCase();

                    const colorAvailable = product.variants.some(
                      (v) =>
                        v.color?.trim().toLowerCase() === color.toLowerCase() &&
                        (availableSizes.length === 0 ||
                          !selectedSize ||
                          v.size?.trim() === selectedSize) &&
                        v.stock > 0,
                    );

                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          setSelectedColor(color);
                          setQuantity(1);
                          setCartMessage("");
                        }}
                        disabled={!colorAvailable}
                        className={`
                          group
                          flex
                          items-center
                          gap-2.5
                          text-sm
                          transition
                          ${
                            !colorAvailable
                              ? "cursor-not-allowed opacity-30"
                              : ""
                          }
                        `}
                      >
                        <span
                          className={`
                            h-7
                            w-7
                            rounded-full
                            border
                            transition-all
                            duration-200

                            ${
                              isSelected
                                ? "border-black ring-1 ring-black ring-offset-2"
                                : "border-gray-300 group-hover:border-black"
                            }
                          `}
                          style={{
                            backgroundColor: getColorValue(color),
                          }}
                        />

                        <span
                          className={`
                            capitalize
                            ${
                              isSelected
                                ? "font-medium text-black"
                                : "text-gray-600"
                            }
                          `}
                        >
                          {color}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STOCK */}

            <div className="mt-8 border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500">
                Availability:{" "}
                <span className="font-medium text-black">
                  {hasVariants && !variantSelectionComplete
                    ? "Select size / color"
                    : effectiveStock > 0
                      ? `${effectiveStock} items available`
                      : "Out of stock"}
                </span>
              </p>
            </div>

            {/* QUANTITY */}

            {(!hasVariants || variantSelectionComplete) &&
              effectiveStock > 0 && (
                <div className="mt-7">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-black">
                    Quantity
                  </p>

                  <div className="flex h-11 w-[130px] items-center border border-gray-300">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="
                        flex
                        h-full
                        w-10
                        items-center
                        justify-center
                        text-lg
                        text-gray-500
                        transition
                        hover:text-black
                        disabled:cursor-not-allowed
                        disabled:text-gray-300
                      "
                    >
                      −
                    </button>

                    <span className="flex-1 text-center text-sm text-black">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={quantity >= effectiveStock}
                      className="
                        flex
                        h-full
                        w-10
                        items-center
                        justify-center
                        text-lg
                        text-gray-500
                        transition
                        hover:text-black
                        disabled:cursor-not-allowed
                        disabled:text-gray-300
                      "
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

            {/* ADD TO CART */}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={
                (hasVariants &&
                  (!variantSelectionComplete || effectiveStock <= 0)) ||
                (!hasVariants && product.stock <= 0) ||
                addingToCart
              }
              className="
                mt-7
                w-full
                bg-black
                px-6
                py-[17px]
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-white
                transition-all
                duration-200
                hover:bg-[#222]
                disabled:cursor-not-allowed
                disabled:bg-gray-300
              "
            >
              {hasVariants && !variantSelectionComplete
                ? "Select Size / Color"
                : effectiveStock <= 0
                  ? "Out of Stock"
                  : addingToCart
                    ? "Adding..."
                    : "Add to Cart"}
            </button>

            {/* CART MESSAGE */}

            {cartMessage && (
              <p
                className={`
                  mt-4
                  text-center
                  text-xs
                  ${
                    cartMessage.includes("successfully")
                      ? "text-green-600"
                      : "text-red-500"
                  }
                `}
              >
                {cartMessage}
              </p>
            )}
          </div>
        </div>

        {/* REVIEWS */}

        <div className="mt-20 border-t border-gray-200 pt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-black">Customer Reviews</h2>

            <span className="text-xs text-gray-500">
              {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
            </span>
          </div>

          {reviewsLoading ? (
            <p className="mt-7 text-sm text-gray-500">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <div className="mt-7 border border-dashed border-gray-300 py-12 text-center">
              <p className="text-sm text-gray-500">No reviews yet.</p>
            </div>
          ) : (
            <div className="mt-8 max-w-[850px] space-y-7">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-7">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <h3 className="text-sm font-medium text-black">
                        {review.user?.name || "Anonymous"}
                      </h3>

                      <div className="mt-2 flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={
                              star <= review.rating
                                ? "text-black"
                                : "text-gray-300"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {review.title && (
                    <h4 className="mt-4 text-sm font-medium text-black">
                      {review.title}
                    </h4>
                  )}

                  {review.comment && (
                    <p className="mt-2 max-w-[750px] text-sm leading-7 text-gray-600">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;

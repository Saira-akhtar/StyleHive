import { useState } from "react";
import { FiStar, FiX } from "react-icons/fi";
import { createReviewAPI } from "../Services/api";

const ReviewForm = ({ userId, orderId, product, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await createReviewAPI({
        user: userId,
        product: product._id,
        order: orderId,
        rating,
        title,
        comment,
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white max-w-[480px] w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#222]"
        >
          <FiX size={20} />
        </button>

        <h3 className="text-[18px] font-semibold text-[#222] mb-1">
          Write a Review
        </h3>
        <p className="text-sm text-gray-500 mb-6">{product.name}</p>

        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <FiStar
                size={28}
                className={
                  star <= (hoverRating || rating)
                    ? "text-[#B87575] fill-[#B87575]"
                    : "text-gray-300"
                }
              />
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 text-sm mb-4 focus:outline-none focus:border-[#B87575]"
        />

        <textarea
          placeholder="Share your experience with this product..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 px-4 py-2 text-sm mb-4 focus:outline-none focus:border-[#B87575]"
        />

        {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-[#222] text-white text-sm font-medium py-3 hover:bg-[#B87575] transition duration-300 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;
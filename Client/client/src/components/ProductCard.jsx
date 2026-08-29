import { useNavigate } from "react-router-dom";
import { FiEye } from "react-icons/fi";

const ProductCard = ({ id, image, badge, brand, name, price }) => {
  const navigate = useNavigate();

  return (
    <div className="group relative cursor-pointer">

      {/* PRODUCT IMAGE */}
      <div
        className="relative aspect-[4/5] w-full overflow-hidden bg-[#f5f5f3]"
        onClick={() => navigate(`/product/${id}`)}
      >
        {/* BADGE */}
        {badge && (
          <span className="absolute left-3 top-3 z-10 bg-black px-3 py-1.5 text-[9px] font-semibold tracking-[1px] text-white">
            {badge}
          </span>
        )}

        {/* IMAGE */}
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* HOVER OVERLAY */}
        <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* QUICK VIEW */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${id}`);
          }}
          className="absolute bottom-4 left-1/2 flex -translate-x-1/2 translate-y-4 items-center gap-2 whitespace-nowrap bg-white px-5 py-3 text-[10px] font-semibold tracking-[1.5px] text-[#111] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-black hover:text-white"
        >
          <FiEye size={15} />
          QUICK VIEW
        </button>
      </div>

      {/* PRODUCT INFO */}
      <div
        className="pt-4"
        onClick={() => navigate(`/product/${id}`)}
      >
        <p className="text-[10px] font-medium uppercase tracking-[1.5px] text-[#888]">
          {brand || "STYLEHIVE"}
        </p>

        <h3 className="mt-1.5 line-clamp-1 text-[15px] font-medium text-[#111] transition-colors duration-200 group-hover:text-[#777]">
          {name}
        </h3>

        <p className="mt-2 text-[14px] font-semibold text-[#333]">
          PKR {Number(price).toLocaleString()}
        </p>
      </div>

    </div>
  );
};

export default ProductCard;
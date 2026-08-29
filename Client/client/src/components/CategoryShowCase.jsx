import { Link } from "react-router-dom";

const categories = [
  {
    label: "MEN",
    tagline: "Elevated everyday essentials.",
    cta: "SHOP MEN",
    to: "/men",
    image: "/src/assets/category-men.png",
  },
  {
    label: "WOMEN",
    tagline: "Effortless style for every you.",
    cta: "SHOP WOMEN",
    to: "/women",
    image: "/src/assets/category-women.png",
  },
  {
    label: "KIDS",
    tagline: "Comfort meets cool everyday.",
    cta: "SHOP KIDS",
    to: "/kids",
    image: "/src/assets/category-kids.png",
  },
];

const CategoryShowcase = () => {
  return (
    <section className="bg-[#0E0D0C] px-8 py-16 md:px-12 lg:px-20">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {categories.map((cat) => (
          <div key={cat.label} className="flex items-center gap-4">
            <img
              src={cat.image}
              alt={cat.label}
              className="h-28 w-24 flex-shrink-0 object-cover md:h-32 md:w-28"
            />

            <div>
              <h3 className="text-[15px] font-semibold uppercase tracking-[0.08em] text-white">
                {cat.label}
              </h3>

              <p className="mt-1 text-[13px] leading-snug text-white/60">
                {cat.tagline}
              </p>

              <Link
                to={cat.to}
                className="group mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white"
              >
                {cat.cta}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryShowcase;
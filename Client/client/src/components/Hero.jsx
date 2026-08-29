import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[calc(100vh-82px)] overflow-hidden bg-[#F4F2EE]">

      {/* Small Editorial Text - Left */}
      <div className="absolute left-8 top-24 z-20 md:left-12 lg:left-20 lg:top-28">
        <p className="text-[9px] font-medium uppercase leading-[1.8] tracking-[0.28em] text-[#24211F]">
          FASHION
          <br />
          THAT MOVES
          <br />
          WITH YOU.
        </p>

        <div className="mt-3 h-[1px] w-8 bg-[#24211F]" />
      </div>


      {/* Huge STYLEHIVE Text */}
      <div className="absolute left-1/2 top-1/2 z-0 w-full -translate-x-1/2 -translate-y-1/2 text-center">
        <h1
          className="
            whitespace-nowrap
            text-[13vw]
            font-bold
            leading-none
            tracking-[-0.03em]
            text-[#11100F]
            md:text-[15.5vw]
            lg:text-[14.5vw]
          "
        >
          STYLEHIVE
        </h1>
      </div>


      {/* Model Image */}
      <div
        className="
          absolute
          bottom-0
          left-1/2
          z-10
          h-[92%]
          w-[65%]
          -translate-x-1/2
          md:h-[94%]
          md:w-[58%]
          lg:h-[96%]
          lg:w-[50%]
        "
      >
        <img
          src="/hero-model.png"
          alt="StyleHive Fashion Collection"
          className="
            h-full
            w-full
            object-contain
            object-bottom
          "
        />
      </div>


      {/* Left Bottom Content */}
      <div className="absolute bottom-10 left-8 z-20 flex items-center gap-5 md:left-12 lg:left-20">

        <Link
          to="/shop"
          className="
            bg-[#11100F]
            px-7
            py-3
            text-[9px]
            font-medium
            uppercase
            tracking-[0.12em]
            text-white
            transition
            duration-300
            hover:bg-[#8F6759]
          "
        >
          SHOP NOW
        </Link>

        <Link
          to="/shop"
          className="
            group
            flex
            items-center
            gap-2
            text-[9px]
            font-medium
            uppercase
            tracking-[0.1em]
            text-[#24211F]
          "
        >
          EXPLORE NEW IN

          <span className="h-[1px] w-7 bg-[#24211F] transition-all duration-300 group-hover:w-10" />
        </Link>

      </div>


      {/* Right Bottom Collection Text */}
      <div className="absolute bottom-10 right-8 z-20 md:right-12 lg:right-20">
        <p className="text-[9px] font-medium uppercase leading-[1.8] tracking-[0.25em] text-[#24211F]">
          NEW
          <br />
          COLLECTION
          <br />
          2026
        </p>

        <div className="mt-3 h-[1px] w-8 bg-[#24211F]" />
      </div>

    </section>
  );
};

export default Hero;
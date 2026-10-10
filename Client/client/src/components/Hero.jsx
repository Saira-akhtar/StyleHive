import { Link } from "react-router-dom";

const Hero = () => {
  return (
    // Phone navbar is 32px bar + 64px header = 96px. Desktop is 82px header.
    <section className="relative min-h-[620px] h-[calc(100svh-96px)] overflow-hidden bg-[#F4F2EE] lg:h-auto lg:min-h-[calc(100vh-82px)]">
      {/* Editorial text: top left */}
      <div className="absolute left-5 top-6 z-20 sm:left-8 md:left-12 md:top-24 lg:left-20 lg:top-28">
        <p className="text-[9px] font-medium uppercase leading-[1.8] tracking-[0.28em] text-[#24211F]">
          FASHION
          <br />
          THAT MOVES
          <br />
          WITH YOU.
        </p>
        <div className="mt-3 h-[1px] w-8 bg-[#24211F]" />
      </div>

      {/* Collection text: top right on phones, bottom right from md up */}
      <div className="absolute right-5 top-6 z-20 text-right sm:right-8 md:bottom-10 md:right-12 md:top-auto md:text-left lg:right-20">
        <p className="text-[9px] font-medium uppercase leading-[1.8] tracking-[0.25em] text-[#24211F]">
          NEW
          <br />
          COLLECTION
          <br />
          2026
        </p>
        <div className="ml-auto mt-3 h-[1px] w-8 bg-[#24211F] md:ml-0" />
      </div>

      {/* Huge STYLEHIVE text */}
      <div className="absolute left-1/2 top-[40%] z-0 w-full -translate-x-1/2 -translate-y-1/2 px-2 text-center md:top-1/2">
        <h1 className="whitespace-nowrap text-[15vw] font-bold leading-none tracking-[-0.03em] text-[#11100F] md:text-[15.5vw] lg:text-[14.5vw]">
          STYLEHIVE
        </h1>
      </div>

      {/* Model image: sits above the 88px bottom bar on phones */}
      <div className="absolute bottom-[88px] left-1/2 z-10 h-[72%] w-[100%] -translate-x-1/2 sm:w-[85%] md:bottom-0 md:h-[94%] md:w-[58%] lg:h-[96%] lg:w-[50%]">
        <img
          src="/hero-model.png"
          alt="StyleHive Fashion Collection"
          className="h-full w-full object-contain object-bottom"
        />
      </div>

      {/* Buttons: centered bottom bar on phones, bottom left from md up */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex h-[88px] items-center justify-center gap-6 bg-[#F4F2EE] md:inset-x-auto md:bottom-10 md:left-12 md:h-auto md:justify-start md:bg-transparent lg:left-20">
        <Link
          to="/shop"
          className="bg-[#11100F] px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white transition duration-300 hover:bg-[#8F6759] md:py-3 md:text-[9px]"
        >
          SHOP NOW
        </Link>

        <Link
          to="/shop"
          className="group flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.1em] text-[#24211F] md:text-[9px]"
        >
          EXPLORE NEW IN
          <span className="h-[1px] w-7 bg-[#24211F] transition-all duration-300 group-hover:w-10" />
        </Link>
      </div>
    </section>
  );
};

export default Hero;
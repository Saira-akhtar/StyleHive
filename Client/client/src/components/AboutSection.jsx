const AboutSection = () => {
  return (
    <section id="about" className="bg-[#f4f4f2] px-6 py-24">
      <div className="mx-auto max-w-[820px]">
        <div className="relative border border-black/10 bg-white px-10 py-14 md:px-16">

          {/* Corner accents */}
          <span className="absolute -left-3 -top-3 h-8 w-8 border-l-2 border-t-2 border-black"></span>
          <span className="absolute -right-3 -bottom-3 h-8 w-8 border-b-2 border-r-2 border-black"></span>

          <p className="mb-3 text-[11px] font-medium tracking-[4px] text-[#c8577e]">
            OUR STORY
          </p>

          <h2 className="text-[30px] font-bold tracking-[-0.5px] text-black md:text-[36px]">
            About The Brand
          </h2>

          <p className="mt-6 max-w-[520px] text-[13px] leading-[24px] text-[#555]">
            StyleHive is a curated fashion destination bringing timeless,
            elevated essentials for men, women, and kids. We believe in
            quality over quantity — pieces designed to last, styled for
            everyday life. Every collection is chosen with intention,
            balancing craft, comfort, and modern minimalism.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
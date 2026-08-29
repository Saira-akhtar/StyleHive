const ContactSection = () => {
  return (
    <section id="contact" className="bg-[#f4f4f2] px-6 pb-24">
      <div className="mx-auto max-w-[820px]">
        <div className="grid grid-cols-1 border border-black/10 md:grid-cols-[1.3fr_1fr]">

          {/* Form side */}
          <div className="bg-white px-8 py-10 md:px-10">
            <form className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="border-b border-black/20 bg-transparent py-2 text-[13px] outline-none focus:border-black"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="border-b border-black/20 bg-transparent py-2 text-[13px] outline-none focus:border-black"
                />
              </div>

              <input
                type="email"
                placeholder="Email Address"
                className="border-b border-black/20 bg-transparent py-2 text-[13px] outline-none focus:border-black"
              />

              <textarea
                placeholder="Your Message"
                rows={4}
                className="resize-none border-b border-black/20 bg-transparent py-2 text-[13px] outline-none focus:border-black"
              />

              <button
                type="button"
                className="mt-2 w-fit bg-black px-7 py-3 text-[11px] font-semibold tracking-[1px] text-white hover:bg-[#222]"
              >
                SEND MESSAGE
              </button>
            </form>
          </div>

          {/* Info side */}
          <div className="flex flex-col justify-center bg-black px-8 py-10 text-white md:px-10">
            <p className="mb-2 text-[11px] font-medium tracking-[4px] text-[#e78ba8]">
              REACH OUT
            </p>
            <h2 className="text-[30px] font-bold leading-[1.1] tracking-[-0.5px]">
              Get In Touch
            </h2>
            <p className="mt-4 text-[13px] leading-[22px] text-white/70">
              Have a question about an order, sizing, or our collections?
              We'd love to hear from you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
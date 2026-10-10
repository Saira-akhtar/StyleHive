import { FiSearch, FiShoppingBag, FiUser, FiMenu, FiX } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCartAPI } from "../Services/api";

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false); // mobile menu open/closed
  const navigate = useNavigate();

  const navLinks = [
    { name: "MEN", path: "/men" },
    { name: "WOMEN", path: "/women" },
    { name: "KIDS", path: "/kids" },
    { name: "SHOP", path: "/shop" },
  ];

  const closeMenu = () => setIsOpen(false);

  const fetchCartCount = async () => {
    try {
      const userData = localStorage.getItem("user");

      if (!userData) {
        setCartCount(0);
        return;
      }

      const userId = JSON.parse(userData)?._id;

      if (!userId) {
        setCartCount(0);
        return;
      }

      const response = await getCartAPI(userId);
      const cart = response.data.cart;

      setCartCount(cart?.cartItems?.length || 0);
    } catch (error) {
      console.error("Navbar cart error:", error);
      setCartCount(0);
    }
  };

  // Warning 1 fix: the async wrapper means setState isn't called
  // synchronously inside the effect body
  useEffect(() => {
    const loadCartCount = async () => {
      await fetchCartCount();
    };

    loadCartCount();

    window.addEventListener("focus", fetchCartCount);
    return () => window.removeEventListener("focus", fetchCartCount);
  }, []);

  // Lock page scroll while the menu is open, and close it on Escape
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const handleSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;

    navigate(`/shop?search=${encodeURIComponent(query)}`);
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // Defined once, used in both the desktop bar and the mobile menu
  const searchBox = (
    <div className="flex items-center border border-gray-300 h-[40px] w-full lg:h-[36px] lg:w-[220px]">
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 h-full px-3 text-[13px] lg:text-[11px] outline-none text-gray-600"
      />
      <button
        onClick={handleSearch}
        aria-label="Search"
        className="h-full w-[42px] bg-black text-white flex items-center justify-center hover:bg-[#B87575] transition duration-300"
      >
        <FiSearch size={16} strokeWidth={2} />
      </button>
    </div>
  );

  return (
    <>
      {/* Top bar */}
      <div className="w-full h-[32px] bg-[#1C1C1C]">
        <div className="max-w-[1200px] mx-auto h-full px-4 sm:px-6 flex items-center justify-end">
          <div className="flex items-center gap-4 text-[10px] text-white">
            <NavLink
              to="/login"
              className="hover:text-[#B87575] transition duration-300"
            >
              LOGIN
            </NavLink>

            <span className="text-gray-500">|</span>

            <NavLink
              to="/register"
              className="hover:text-[#B87575] transition duration-300"
            >
              REGISTER
            </NavLink>
          </div>
        </div>
      </div>

      {/* sticky keeps the navbar on screen while scrolling */}
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto h-[64px] lg:h-[82px] px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" onClick={closeMenu}>
            <h1 className="font-serif text-[22px] lg:text-[25px] font-bold tracking-[0.02em] text-[#222]">
              <span className="text-[#B87575]">STYLE</span>
              HIVE
            </h1>
          </NavLink>

          {/* Desktop links (lg and up) */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-[10px] font-medium transition duration-300 ${
                    isActive
                      ? "text-[#B87575]"
                      : "text-[#222] hover:text-[#B87575]"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Desktop search only; on mobile it sits inside the menu */}
            <div className="hidden lg:block">{searchBox}</div>

            <NavLink
              to="/profile"
              onClick={closeMenu}
              aria-label="Profile"
              className="text-[#222] hover:text-[#B87575] transition duration-300"
            >
              <FiUser size={21} strokeWidth={1.7} />
            </NavLink>

            <NavLink
              to="/cart"
              onClick={closeMenu}
              aria-label="Cart"
              className="flex items-center text-[#222] hover:text-[#B87575] transition duration-300"
            >
              <div className="relative">
                <FiShoppingBag size={21} strokeWidth={1.7} />

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#B87575] text-white text-[9px] font-medium w-[17px] h-[17px] rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </NavLink>

            {/* Hamburger: visible below lg only */}
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              className="lg:hidden text-[#222] hover:text-[#B87575] transition duration-300"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu: opens with a max-height transition */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 bg-white ${
            isOpen ? "max-h-[420px] border-t border-gray-200" : "max-h-0"
          }`}
        >
          <div className="px-4 sm:px-6 py-5 flex flex-col gap-5">
            {searchBox}

            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={closeMenu} // Warning 2 fix: close from the click, not an effect
                  className={({ isActive }) =>
                    `py-3 text-[13px] font-medium tracking-wide border-b border-gray-100 transition duration-300 ${
                      isActive
                        ? "text-[#B87575]"
                        : "text-[#222] hover:text-[#B87575]"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Dark overlay behind the menu; tapping it closes the menu */}
      {isOpen && (
        <div
          onClick={closeMenu}
          className="lg:hidden fixed inset-0 bg-black/30 z-40"
        />
      )}
    </>
  );
};

export default Navbar;
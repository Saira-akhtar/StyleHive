import { FiSearch, FiShoppingBag, FiUser } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCartAPI } from "../Services/api";

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const navLinks = [
    { name: "MEN", path: "/men" },
    { name: "WOMEN", path: "/women" },
    { name: "KIDS", path: "/kids" },
    { name: "SHOP", path: "/shop" },
  ];

  const fetchCartCount = async () => {
    try {
      const userData = localStorage.getItem("user");

      if (!userData) {
        setCartCount(0);
        return;
      }

      const user = JSON.parse(userData);

      const userId = user?._id;

      if (!userId) {
        setCartCount(0);
        return;
      }

      const response = await getCartAPI(userId);

      console.log("NAVBAR CART:", response.data);

      const cart = response.data.cart;

      if (!cart || !cart.cartItems) {
        setCartCount(0);
        return;
      }

      setCartCount(cart.cartItems.length);
    } catch (error) {
      console.error("Navbar cart error:", error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    const loadCartCount = async () => {
      await fetchCartCount();
    };

    loadCartCount();

    window.addEventListener("focus", fetchCartCount);

    return () => {
      window.removeEventListener("focus", fetchCartCount);
    };
  }, []);
  const handleSearch = () => {
    const query = searchQuery.trim();

    if (!query) return;

    navigate(`/shop?search=${encodeURIComponent(query)}`);

    setSearchQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <div className="w-full h-[32px] bg-[#1C1C1C]">
        <div className="max-w-[1200px] mx-auto h-full px-6 flex items-center justify-end">
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

      <header className="w-full bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto h-[82px] px-6 flex items-center justify-between">
          <NavLink to="/">
            <h1 className="font-serif text-[25px] font-bold tracking-[0.02em] text-[#222]">
              <span className="text-[#B87575]">STYLE</span>
              HEIVE
            </h1>
          </NavLink>

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

          <div className="flex items-center gap-5">
            <div className="flex items-center border border-gray-300 h-[36px] w-[220px]">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 h-full px-3 text-[11px] outline-none text-gray-600"
              />

              <button
                onClick={handleSearch}
                className="h-full w-[42px] bg-black text-white flex items-center justify-center hover:bg-[#B87575] transition duration-300"
              >
                <FiSearch size={16} strokeWidth={2} />
              </button>
            </div>

            {/* PROFILE */}
            <NavLink
              to="/profile"
              className="text-[#222] hover:text-[#B87575] transition duration-300"
            >
              <FiUser size={21} strokeWidth={1.7} />
            </NavLink>

            {/* CART */}
            <NavLink
              to="/cart"
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
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;

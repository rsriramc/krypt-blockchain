import { useState } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import Logo from "../../images/logo.png";

const NavbarItem = ({ title, classProps }) => {
  return <li className={`mx-4 cursor-pointer ${classProps} hover:underline`}>{title}</li>;
};

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <img src={Logo} alt="logo" className="w-32 cursor-pointer" />
      </div>
      <ul className="text-white md:flex hidden flex-row list-none justify-between items-center flex-initial">
        {["Market", "Exchange", "Tutorial", "Wallets"].map((item, index) => {
          return <NavbarItem title={item} key={item + index} />;
        })}
        <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2456bd]">
          Login
        </li>
      </ul>
      <div className="flex relative" onClick={() => setShowMenu(!showMenu)}>
        {showMenu ? (
          <AiOutlineClose fontSize={28} className="text-white md:hidden	 cursor-pointer" />
        ) : (
          <HiMenuAlt4 fontSize={28} className="text-white md:hidden	 cursor-pointer" />
        )}
        {showMenu && (
          <ul
            className="
				z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
				flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in
			"
          >
            <li className="text-xl w-full my-2">
              <AiOutlineClose
                onClick={() => setShowMenu(false)}
                className="cursor-pointer"
              />
            </li>
            {["Market", "Exchange", "Tutorial", "Wallets"].map(
              (item, index) => {
                return (
                  <NavbarItem
                    title={item}
                    key={item + index}
                    classProps="my-2 text-lg"
                  />
                );
              }
            )}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

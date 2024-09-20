'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  return (
    <nav className="bg-[#050505] fixed w-full z-20 top-0 start-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center ">
          <Image src='https://www.nasheedio.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.a9520556.png&w=256&q=75' alt="Logo" width={120} height={120} />
        </Link>

        <div className="flex md:order-2 space-x-3 md:space-x-0 ">
          <button
            type="button"
            className="text-[#000000] font-['Neue_Montreal'] bg-[#eeeeee] hover:bg-[#048a94] outline-none font-medium rounded-lg text-md px-4 py-2 text-center"
          >
            Get started
          </button>

          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-[#DDDBCB] rounded-lg md:hidden"
            aria-controls="navbar-sticky"
            aria-expanded={navOpen ? 'true' : 'false'}
            onClick={toggleNav}
          >
            {navOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${navOpen ? 'block' : 'hidden'}`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 font-['Neue_Montreal'] text-md font-bold mt-4  border rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 border-gray-700">
            <li>
              <Link
                href="/nasheed"
                className="block py-2 px-3 text-[#DDDBCB] hover:text-[#68ff04]  rounded md:bg-transparent"
                aria-current="page"
              >
                nasheed
              </Link>
            </li>
            <li>
              <Link
                href="/upload"
                className="block py-2 px-3 text-[#DDDBCB] hover:text-[#68ff04] rounded md:bg-transparent"
              >
                upload
              </Link>
            </li>
            <li>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

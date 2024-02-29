import Cookies from 'js-cookie'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../Context/AuthContext'
import logo from "../assets/apwalogo.png"

export const Navbar = () => {
  const { setUser } = useAuthContext()
  const navigate = useNavigate()

  return (
    <>
      <div className="hidden md:block h-screen bg-gray-900 text-white fixed left-0 top-0 w-[225px] flex flex-col justify-between md:hidden lg:block">
        <div className="py-4 pl-5">
          {/* Logo or Brand */}
          <div className="text-center">
            <Link to={"/dashboard"}> <h1 className='text-3xl font-semibold text-left logo'>Apwa</h1>
            </Link>
          </div>
          <hr className="my-4 border-gray-700" />
          {/* Navigation Links */}
          <ul>
            <li className="mb-2">
              <Link to="/dashboard" className="block p-2 text-left text-sm hover:text-[#3498db]">Dashboard</Link>
            </li>
            <li className="mb-2">
              <Link to="/POS" className="block p-2 text-left text-sm hover:text-[#3498db]">POS</Link>
            </li>
            <li className="mb-2">
              <Link to="/viewpos" className="block p-2 text-left text-sm hover:text-[#3498db]">View POS</Link>
            </li>
            <li className="mb-2">
              <Link to="/addproduct" className="block p-2 text-left text-sm  hover:text-[#3498db]">Add Products</Link>
            </li>
            <li className="mb-2">
              <Link to="/viewproducts" className="block p-2 text-left text-sm hover:text-[#3498db]">View Products</Link>
            </li>
            <li className="mb-2">
              <Link to="/viewcategories" className="block p-2 text-left text-sm hover:text-[#3498db]">View Categories</Link>
            </li>
            <li className="mb-2">
              <Link to="/addpurchase" className="block p-2 text-left text-sm hover:text-[#3498db]">Add Purchase</Link>
            </li>
            <li className="mb-2">
              <Link to="/viewpurchase" className="block p-2 text-left text-sm hover:text-[#3498db]">View Purchase</Link>
            </li>
          </ul>
        </div>
        {/* Footer or Additional Links */}
        <div className="py-4 pl-5 text-left">
          <button className="p-2  text-sm hover:bg-red-600"
            onClick={() => {
              Cookies.remove("token");
              setUser(false);
              navigate("/");
            }}>Logout</button>
        </div>
      </div>
    </>


  )
}

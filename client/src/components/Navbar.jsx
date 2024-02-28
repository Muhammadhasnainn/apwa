import Cookies from 'js-cookie'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../Context/AuthContext'

export const Navbar = () => {
  const {setUser} = useAuthContext()
const navigate = useNavigate()

  return (
    <>
    <div className="hidden md:block h-screen bg-white text-gray-700 fixed left-0 top-0 w-[200px] flex flex-col justify-between md:hidden lg:block">
      <div className="py-4 pl-5">
        {/* Logo or Brand */}
        <div className="text-center">
          <span className="text-lg font-bold">
            <img src="/public/apwalogo.png" className="" alt="Logo" />
          </span>
        </div>
        <hr className="my-4 border-gray-300" />
        {/* Navigation Links */}
        <ul>
          <li className="mb-2">
            <Link to="/dashboard" className="block p-2 text-left text-sm hover:bg-purple-200">Dashboard</Link>
          </li>
          <li className="mb-2">
            <Link to="/POS" className="block p-2 text-left text-sm hover:bg-purple-200">POS</Link>
          </li>
          <li className="mb-2">
            <Link to="/viewpos" className="block p-2 text-left text-sm hover:bg-purple-200">View POS</Link>
          </li>
          <li className="mb-2">
            <Link to="/addproduct" className="block p-2 text-left text-sm  hover:bg-purple-200">Add Products</Link>
          </li>
          <li className="mb-2">
            <Link to="/viewproducts" className="block p-2 text-left text-sm hover:bg-purple-200">View Products</Link>
          </li>
          <li className="mb-2">
            <Link to="/viewcategories" className="block p-2 text-left text-sm hover:bg-purple-200">View Categories</Link>
          </li>
          <li className="mb-2">
            <Link to="/addpurchase" className="block p-2 text-left text-sm hover:bg-purple-200">Add Purchase</Link>
          </li>
          <li className="mb-2">
            <Link to="/viewpurchase" className="block p-2 text-left text-sm hover:bg-purple-200">View Purchase</Link>
          </li>
        </ul>
      </div>
      {/* Footer or Additional Links */}
      <div className="py-4 text-center">
        <a href="#" className=" p-2 text-sm hover:bg-blue-200 me-2">Settings</a>
        <button className=" p-2 text-sm bg-red-600 text-white items-center"
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

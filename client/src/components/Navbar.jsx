import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../Context/AuthContext'
import logo from "../assets/apwalogo.png"
import { GiHamburgerMenu } from "react-icons/gi";
import { MdDashboard } from "react-icons/md";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { FaListUl } from "react-icons/fa6";
import { IoBagAdd } from "react-icons/io5";
import { ImList2 } from "react-icons/im";
import { BiCategory } from "react-icons/bi";
import { PiKeyReturnFill } from "react-icons/pi";




export const Navbar = () => {
  const location = useLocation();
  const { setUser, toggle, setToggle } = useAuthContext()
  const navigate = useNavigate();

  const handletoggle = () => {
    if (toggle === false) {
      document.querySelectorAll(".w_content").forEach((elem) => {
        elem.style.marginLeft = "75px";
      })
    } else {
      document.querySelectorAll(".w_content").forEach((elem) => {
        elem.style.marginLeft = "225px";
      })
    }
    setToggle(!toggle)
  }


  useEffect(() => {
    if (toggle) {
      document.querySelectorAll(".w_content").forEach((elem) => {
        elem.style.marginLeft = "75px";
      })
    } else {
      document.querySelectorAll(".w_content").forEach((elem) => {
        elem.style.marginLeft = "225px";
      })
    }
  }, [])

  return (

    <>
      {!toggle ?
        <>
        {/* bg-gray-900 */}
          <div className="transition-all h-screen rounded-3xl p-2 bg-gray-900  text-white border-8   border-[#f3f4f6] fixed left-0 top-0 w-[250px] flex flex-col justify-between md:hidden lg:block">
            <div className="py-4 pl-2">
              {/* Logo or Brand */}
              <div className="text-center flex justify-between items-center">
                <Link to={"/dashboard"}> <h1 className='text-3xl i font-semibold text-left logo'>Apwa</h1>


                </Link>
                <GiHamburgerMenu size={20} className='me-3' cursor={"pointer"} onClick={handletoggle} />
              </div>
              <hr className="my-4 border-gray-700" />
              {/* Navigation Links */}
              <ul>
                <li className="mb-2">
                  <Link to="/dashboard"
                    className="block p-2 text-left text-sm hover:bg-[#3498db]"
                    style={{
                      color: location.pathname === '/dashboard' ? "#3498db" : "white",
                      background: location.pathname === '/dashboard' ? "transparent" : ""
                    }}>Dashboard</Link>
                </li>
                <li className="mb-2">
                  <Link to="/POS" className="block p-2 text-left text-sm hover:bg-[#3498db]"
                    style={{
                      color: location.pathname === '/POS' ? "#3498db" : "white",
                      background: location.pathname === '/POS' ? "transparent" : ""
                    }}>POS</Link>
                </li>
                <li className="mb-2">
                  <Link to="/viewpos" className="block p-2 text-left text-sm hover:bg-[#3498db]"
                    style={{
                      color: location.pathname === '/viewpos' ? "#3498db" : "white",
                      background: location.pathname === '/viewpos' ? "transparent" : ""
                    }}>View Sales</Link>
                </li>
                <li className="mb-2">
                  <Link to="/addproduct" className="block p-2 text-left text-sm  hover:bg-[#3498db]"
                    style={{
                      color: location.pathname === '/addproduct' ? "#3498db" : "white",
                      background: location.pathname === '/addproduct' ? "transparent" : ""
                    }}>Add Products</Link>
                </li>
                <li className="mb-2">
                  <Link to="/viewproducts"
                    style={{
                      color: location.pathname === '/viewproducts' ? "#3498db" : "white",
                      background: location.pathname === '/viewproducts' ? "transparent" : ""
                    }}
                    className="block p-2 text-left text-sm hover:bg-[#3498db]">View Products</Link>
                </li>
                <li className="mb-2">
                  <Link to="/viewcategories"
                    style={{
                      color: location.pathname === '/viewcategories' ? "#3498db" : "white",
                      background: location.pathname === '/viewcategories' ? "transparent" : ""
                    }}
                    className="block p-2 text-left text-sm hover:bg-[#3498db]">View Categories</Link>
                </li>
                <li className="mb-2">
                  <Link to="/addpurchase"
                    style={{
                      color: location.pathname === '/addpurchase' ? "#3498db" : "white",
                      background: location.pathname === '/addpurchase' ? "transparent" : ""
                    }}
                    className="block p-2 text-left text-sm hover:bg-[#3498db] ">Add Purchase</Link>
                </li>
                <li className="mb-2">
                  <Link to="/viewpurchase"
                    className="block p-2 text-left text-sm hover:bg-[#3498db]"
                    style={{
                      color: location.pathname === '/viewpurchase' ? "#3498db" : "white",
                      background: location.pathname === '/viewpurchase' ? "transparent" : ""
                    }}
                  >View Purchase</Link>
                </li>
                <li className="mb-2">
                  <Link to="/viewreturns" className="block p-2 text-left text-sm hover:bg-[#3498db]"
                    style={{
                      color: location.pathname === '/viewreturns' ? "#3498db" : "white",
                      background: location.pathname === '/viewreturns' ? "transparent" : ""
                    }}>View Returns</Link>
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


        : <>
          <div className="transition-all h-screen bg-gray-900 text-white fixed left-0 top-0 w-[100px] flex flex-col justify-between md:hidden lg:block border-8   border-[#f3f4f6]">
            <div className="py-4">
              {/* Logo or Brand */}
              <div className="">

                <GiHamburgerMenu size={30} className='me-3 ml-8' cursor={"pointer"} onClick={handletoggle} />
              </div>
              <hr className="my-4 border-gray-700" />
              {/* Navigation Links */}
              <ul>
                <li className="mb-2 ">
                  <Link to="/dashboard"
                    className="block p-2 hover:bg-[#3498db]"
                    style={{
                      color: location.pathname === '/dashboard' ? "#3498db" : "white",
                      background: location.pathname === '/dashboard' ? "transparent" : ""
                    }}><MdDashboard size={25} className='mx-auto' color='' />
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/POS" className="block p-2 text-left text-sm hover:bg-[#3498db]"
                    style={{
                      color: location.pathname === '/POS' ? "#3498db" : "white",
                      background: location.pathname === '/POS' ? "transparent" : ""
                    }}><MdOutlineDocumentScanner size={25} className='mx-auto' />
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/viewpos" className="block p-2 text-left text-sm hover:bg-[#3498db]"
                    style={{
                      color: location.pathname === '/viewpos' ? "#3498db" : "white",
                      background: location.pathname === '/viewpos' ? "transparent" : ""
                    }}><FaListUl size={25} className='mx-auto' />


                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/addproduct" className="block p-2 text-left text-sm  hover:bg-[#3498db]"
                    style={{
                      color: location.pathname === '/addproduct' ? "#3498db" : "white",
                      background: location.pathname === '/addproduct' ? "transparent" : ""
                    }}><IoBagAdd size={25} className='mx-auto' />
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/viewproducts"
                    style={{
                      color: location.pathname === '/viewproducts' ? "#3498db" : "white",
                      background: location.pathname === '/viewproducts' ? "transparent" : ""
                    }}
                    className="block p-2 text-left text-sm hover:bg-[#3498db]"><ImList2 size={25} className='mx-auto' />
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/viewcategories"
                    style={{
                      color: location.pathname === '/viewcategories' ? "#3498db" : "white",
                      background: location.pathname === '/viewcategories' ? "transparent" : ""
                    }}
                    className="block p-2 text-left text-sm hover:bg-[#3498db]"><BiCategory size={25} className='mx-auto' />
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/addpurchase"
                    style={{
                      color: location.pathname === '/addpurchase' ? "#3498db" : "white",
                      background: location.pathname === '/addpurchase' ? "transparent" : ""
                    }}
                    className="block p-2 text-left text-sm hover:bg-[#3498db] "><IoBagAdd size={25} className='mx-auto' /></Link>
                </li>
                <li className="mb-2">
                  <Link to="/viewpurchase"
                    className="block p-2 text-left text-sm hover:bg-[#3498db]"
                    style={{
                      color: location.pathname === '/viewpurchase' ? "#3498db" : "white",
                      background: location.pathname === '/viewpurchase' ? "transparent" : ""
                    }}
                  ><ImList2 size={25} className='mx-auto' /></Link>
                </li>

                <li className="mb-2">
                  <Link to="/viewreturns"
                    className="block p-2 text-left text-sm hover:bg-[#3498db]"
                    style={{
                      color: location.pathname === '/viewreturns' ? "#3498db" : "white",
                      background: location.pathname === '/viewreturns' ? "transparent" : ""
                    }}
                  ><PiKeyReturnFill size={25} className='mx-auto' /></Link>
                </li>
              </ul>
            </div>
            {/* Footer or Additional Links */}
            <div className="py-4  text-center">
              <button className="p-2  text-sm hover:bg-red-600"
                onClick={() => {
                  Cookies.remove("token");
                  setUser(false);
                  navigate("/");
                }}>Logout</button>
            </div>


          </div>
        </>
      }
    </>


  )
}

import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { FaGoogle } from "react-icons/fa"
import axios from "axios";
import jwt_decode from "jwt-decode"
import Cookies from "js-cookie";
import { useAuthContext } from '../Context/AuthContext';
import logo from "../assets/apwalogo.png"

function Signin() {
  const [cred, setCred] = useState({ email: "", password: "" })
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate()


  const Login = async (e) => {
    e.preventDefault()
    if (cred.email.length > 0 && cred.password.length > 0) {
      //   setLoading(true)
      const { data } = await axios.post(import.meta.env.VITE_API_URL + "/api/auth/login", {
        email: cred.email,
        password: cred.password
      })


      if (data.success) {
        setUser(jwt_decode(data.authToken))
        Cookies.set("token", data.authToken, { secure: true });
        navigate("/dashboard")
      } else {
        alert(data.message)
      }

      //   setLoading(false)
    } else {
      //   setLoading(false)
      alert("Please fill all fields")
    }
  };

  if (user) return <Navigate to={"/dashboard"} />
  
  return (
    <>
      <div className="flex justify-center items-center login_page">
        <div className="form flex flex-col  h-fit justify-center rounded-xl align-middle sm:px-10 py-5 md:">
          <div className="small-logo w-100 justify-center flex ">
            <img className='w-36' src="/public/images/apwalogo.png" alt="" />
          </div>
          <h1 className='font-semibold text-2xl p-3 text-center'>Login to your account</h1>
          <p className='text-white'>Welcome back! Please enter your details.</p>

          <form className='my-8 flex flex-col' onSubmit={Login}>
            <div className="mb-3 flex flex-col justify-start">
              <p className='text-white text-left'>Email</p>
              <input onChange={(e) => setCred((prev) => ({ ...prev, email: e.target.value }))} className='bg-white border w-100 border-slate outline-none  p-3 mt-2 rounded-md text-black' type="email" name='email' />
            </div>
            <div className="mb-3 flex flex-col justify-start">
              <p className=' text-left'>Password</p>
              <input className='bg-white  text-black border w-100 border-slate p-3 mt-2 rounded-md outline-none'
                onChange={(e) => setCred((prev) => ({ ...prev, password: e.target.value }))} type="password" name='password' />
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex flex-col mt-0">
                <input className='p-3 w-100 bg-blue-700 cursor-pointer text-white my-5 uppercase font-semibold rounded-md'
                  type="submit" value="Signin" />
              </div>
            </div>

          </form>
        </div>
      </div>
    </>)
}

export default Signin
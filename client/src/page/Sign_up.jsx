import React from 'react'
import { Link } from 'react-router-dom'
import { FaGoogle } from "react-icons/fa"   

function Sign_up() {
    const formHandler = () => {
        console.log("hello")
    }
    return (
        <>
            <div className=" flex justify-around align-middle">
                <div className="  sm:block logo flex justify-center items-center h-full">
                    <div className="wrapper flex justify-center items-center">
                        <img src="/public/apwalogo.png" className="h-12 block md:mt-60" alt="Logo" />
                    </div>
                </div>
                <div className="form flex flex-col justify-center align-middle sm:p-10">
                    <div className="small-logo w-100 justify-center flex ">
                        <img className='w-36' src="/public/images/apwalogo.png" alt="" />
                    </div>
                    <h1 className='font-semibold text-2xl p-3'>Create An Account</h1>
                    <p className='text-slate-500'>Welcome back! Please enter your details.</p>

                    <form onChange={formHandler} className='my-8 flex flex-col'>
                    <div className="mb-3 flex flex-col justify-start">
                            <p className='text-slate-700 text-left'>Name</p>
                            <input className='bg-transparent border w-100 border-slate  p-3 mt-2 rounded-md' type="email" name='email' />
                        </div>
                        <div className="mb-3 flex flex-col justify-start">
                            <p className='text-slate-700 text-left'>Email</p>
                            <input className='bg-transparent border w-100 border-slate  p-3 mt-2 rounded-md' type="email" name='email' />
                        </div>
                        <div className="mb-3 flex flex-col justify-start">
                            <p className='text-slate-700 text-left'>Password</p>
                            <input className='bg-transparent border w-100 border-slate p-3 mt-2 rounded-md' type="password" name='password' />
                        </div>

                        <div className="flex flex-col justify-center">
                            <div className="wrapper flex">
                                
                                <p className='text-slate-800'>Must be atleast 8 characters</p>
                            </div>
                            <div className="flex flex-col my-5">
                                <input className='p-3 w-100 bg-blue-700 text-white my-5 uppercase font-semibold rounded-md' type="submit" value="Get Started" />
                                <button className='p-3 w-100 shadow-lg text-slate-700 uppercase font-semibold flex justify-center gap-4 rounded-md'><FaGoogle className='text-xl' />Signin with Google</button>
                            </div>
                            {/* <Link to='/'>Forget password</Link> */}

                            <p>Already have an account? <span className='mt-5 text-blue-700'>Log in</span></p>
                        </div>

                    </form>
                </div>
            </div>
        </>)
}

export default Sign_up
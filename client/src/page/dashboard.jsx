import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { useAuthContext } from '../Context/AuthContext';
import { Navigate, useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import axios from 'axios';
import { FcSalesPerformance } from "react-icons/fc";
import { FaCalendarAlt } from "react-icons/fa";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { MdPointOfSale } from "react-icons/md";
import { MdAssignmentReturned } from "react-icons/md";


function Dashboard() {
    const [Tsales, setTsales] = useState("");
    const [Msales, setMsales] = useState("");
    const [Mpurchase, setMpurchase] = useState("");
    const [Tpurchase, setTpurchase] = useState("");
    const [salesR, setSalesR] = useState("");
    const [purchasedR, setPurchasedR] = useState("");




    const { user } = useAuthContext();




    const fetchData = async () => {
        try {
            const totalSales = await axios.get(import.meta.env.VITE_API_URL + "/api/stats/sales", {
                headers: {
                    "Content-Type": "application/json",
                    token: Cookies.get("token"),
                },
            });

            const monthlySales = await axios.get(import.meta.env.VITE_API_URL + "/api/stats/salesmonthly", {
                headers: {
                    "Content-Type": "application/json",
                    token: Cookies.get("token"),
                },
            });



            const Purchased = await axios.get(import.meta.env.VITE_API_URL + "/api/stats/purchased", {
                headers: {
                    "Content-Type": "application/json",
                    token: Cookies.get("token"),
                },
            });

            const monthlyPurchased = await axios.get(import.meta.env.VITE_API_URL + "/api/stats/purchasedmonthly", {
                headers: {
                    "Content-Type": "application/json",
                    token: Cookies.get("token"),
                },
            });


            const salesreturn = await axios.get(import.meta.env.VITE_API_URL + "/api/stats/salesreturn", {
                headers: {
                    "Content-Type": "application/json",
                    token: Cookies.get("token"),
                },
            });



            const purchasesreturn = await axios.get(import.meta.env.VITE_API_URL + "/api/stats/returnpurchases", {
                headers: {
                    "Content-Type": "application/json",
                    token: Cookies.get("token"),
                },
            });


            setTsales(totalSales.data.grandTotal ? totalSales.data.grandTotal : 0);
            setMsales(monthlySales.data.grandTotal ? monthlySales.data.grandTotal : 0);
            setTpurchase(Purchased.data.grandTotal ? Purchased.data.grandTotal : 0)
            setMpurchase(monthlyPurchased.data.grandTotal ? monthlyPurchased.data.grandTotal : 0)
            setSalesR(salesreturn.data.grandTotal ? salesreturn.data.grandTotal : 0)
            setPurchasedR(purchasesreturn.data.grandTotal ? purchasesreturn.data.grandTotal : 0)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])


    if (!user) return <Navigate to={"/"} />

    return (
        <div className="flex  min-h-screen bg-gray-100"> {/* Background color applied to the entire dashboard */}
            {/* Left Navbar */}
            <Navbar />
            {/* Body */}
            <div className="flex flex-col flex-grow py-8 px-10 ml-[225px]">
                <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
                <div className="flex "> {/* Flex container for cards */}
                    {/* Sales Overview Card */}
                    <div className="bg-white rounded-lg p-4 shadow-lg ml-3 " style={{ flex: 2, maxHeight: '12rem' }}> {/* Sales Overview card takes up 2/3 of the space */}
                        <h2 className="text-lg text-left font-semibold mb-4">Sales Overview</h2>
                        <div className="flex">
                            {/* Column 1 */}
                            <div className="text-center flex-1 flex flex-col items-center justify-between">
                                {/* <img src={saleimg} alt="Sales Icon" className="w-12 h-12 mb-2" /> */}
                                <FcSalesPerformance size={50} />
                                <div>
                                    <p className="text-base mb-1">Sales</p>
                                    <p className="text-2xl">RS {Number(Tsales).toLocaleString()}</p>
                                </div>
                            </div>
                            {/* Column 2 */}
                            <div className="text-center flex-1 flex flex-col items-center justify-between">
                                {/* <img src={revenueimg} alt="Revenue Icon" className="w-12 h-12 mb-2" /> */}
                                <FaCalendarAlt size={45} color='#3498db' />
                                <div>
                                    <p className="text-base  mb-1">Month Sales</p>
                                    <p className=" text-2xl">RS {Number(Msales).toLocaleString()} </p>
                                </div>
                            </div>
                            {/* Column 3 */}
                            <div className="text-center flex-1 flex flex-col items-center justify-between">
                                {/* <img src={puricon} alt="Revenue Icon" className="w-12 h-12 mb-2" /> */}
                                <BiSolidPurchaseTagAlt size={50} color='#FFA000' />
                                <div>
                                    <p className="text-base  mb-1">Purchases</p>
                                    <p className=" text-2xl">RS {Number(Tpurchase).toLocaleString()} </p>
                                </div>
                            </div>
                            {/* Column 4 */}
                            <div className="text-center flex-1 flex flex-col items-center justify-between">
                                {/* <img src={revenueimg} alt="Revenue Icon" className="w-12 h-12 mb-2" /> */}
                                <FaCalendarAlt size={45} color='#3498db' />
                                <div>
                                    <p className="text-base mb-1">Month Purchase</p>
                                    <p className=" text-2xl">RS {Number(Mpurchase).toLocaleString()} </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-lg ml-3" style={{ flex: 1, maxHeight: '12rem' }}>
                        <h2 className="text-lg text-left font-semibold mb-4">Returns</h2>
                        <div className="flex">
                            <div className="text-center flex-1 flex flex-col items-center justify-between">
                                {/* <img src={quanimg} alt="Sales Icon" className="w-12 h-12 mb-2" /> */}
                                <MdPointOfSale size={45} color='#3498db' />
                                <div>

                                    <p className="text-base mb-1">POS returns</p>
                                    <p className="text-2xl text-gray-600">RS {salesR}</p>

                                </div>
                            </div>
                            <div className="text-center flex-1 flex flex-col items-center justify-between">
                                {/* <img src={wayImg} alt="Revenue Icon" className="w-12 h-12 mb-2" /> */}
                                <MdAssignmentReturned size={45} color='#3498db' />
                                <div>
                                    <p className="text-base mb-1">To be received</p>
                                    <p className="text-2xl text-gray-600">RS {purchasedR}</p>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="flex mt-3"> 
                    <div className="bg-white rounded-lg p-4 shadow-lg ml-3" style={{ flex: 2, maxHeight: '12rem' }}> 
                        <h2 className="text-lg text-left font-semibold mb-4">Purchase Overview</h2>
                        <div className="flex">
                            <div className="text-center flex-1 flex flex-col items-center">
                                <img src="/public/Purchase.png" alt="Sales Icon" className="w-12 h-12 mb-2" />
                                <p className="text-base mb-1">Purchase</p>
                                <p className="text-sm text-gray-600">$10,000</p>
                            </div>
                            <div className="text-center flex-1 flex flex-col items-center">
                                <img src="/public/Cost.png" alt="Revenue Icon" className="w-12 h-12 mb-2" />
                                <p className="text-base mb-1">Cost</p>
                                <p className="text-sm text-gray-600">$10,000</p>
                            </div>
                            <div className="text-center flex-1 flex flex-col items-center">
                                <img src="/public/Cancel.png" alt="Profit Icon" className="w-12 h-12 mb-2" />
                                <p className="text-base mb-1">Cancel</p>
                                <p className="text-sm text-gray-600">$5,000</p>
                            </div>
                            <div className="text-center flex-1 flex flex-col items-center">
                                <img src="/public/Profit.png" alt="Cost Icon" className="w-12 h-12 mb-2" />
                                <p className="text-base mb-1">Return</p>
                                <p className="text-sm text-gray-600">$5,000</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-lg ml-3" style={{ flex: 1, maxHeight: '12rem' }}> 
                        <h2 className="text-lg text-left font-semibold mb-4">Product Summary</h2>
                        <div className="flex">
                            <div className="text-center flex-1 flex flex-col items-center">
                                <img src="/public/Quantity.png" alt="Sales Icon" className="w-12 h-12 mb-2" />
                                <p className="text-sm text-gray-600">$10,000</p>

                                <p className="text-base mb-1">Number of Suppliers</p>
                            </div>
                            <div className="text-center flex-1 flex flex-col items-center">
                                <img src="/public/On the way.png" alt="Revenue Icon" className="w-12 h-12 mb-2" />
                                <p className="text-sm text-gray-600">$10,000</p>

                                <p className="text-base mb-1">Number of Categories</p>
                            </div>
                        </div>
                    </div>
                </div> */}

            </div>
        </div>
    );
}

export default Dashboard;

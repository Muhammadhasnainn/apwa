import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { useAuthContext } from '../Context/AuthContext';
import { Navigate, useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import axios from 'axios';

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


            setTsales(totalSales.data.grandTotal);
            setMsales(monthlySales.data.grandTotal);
            setTpurchase(Purchased.data.grandTotal)
            setMpurchase(monthlyPurchased.data.grandTotal)
            setSalesR(salesreturn.data.grandTotal)
            setPurchasedR(purchasesreturn.data.grandTotal)



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
            <div className="flex flex-col flex-grow p-8 ml-[200px]">
                <h1 className="text-3xl font-bold mb-8 text-center">Dashboard</h1>
                <div className="flex "> {/* Flex container for cards */}
                    {/* Sales Overview Card */}
                    <div className="bg-white rounded-lg p-4 shadow-lg ml-3 " style={{ flex: 2, maxHeight: '12rem' }}> {/* Sales Overview card takes up 2/3 of the space */}
                        <h2 className="text-lg text-left font-semibold mb-4">Sales Overview</h2>
                        <div className="flex">
                            {/* Column 1 */}
                            <div className="text-center flex-1 flex flex-col items-center">
                                <img src="/public/sales.png" alt="Sales Icon" className="w-12 h-12 mb-2" />
                                <p className="text-base mb-1">Sales</p>
                                <p className="font-bold text-gray-600 text-2xl">$ {Number(Tsales).toLocaleString()}</p>
                            </div>
                            {/* Column 2 */}
                            <div className="text-center flex-1 flex flex-col items-center">
                                <img src="/public/Revenue.png" alt="Revenue Icon" className="w-12 h-12 mb-2" />
                                <p className="text-base  mb-1">Month Sales</p>
                                <p className="font-bold text-gray-600 text-2xl">$ {Number(Msales).toLocaleString()} </p>
                            </div>
                            {/* Column 3 */}
                            <div className="text-center flex-1 flex flex-col items-center">
                                <img src="/public/Revenue.png" alt="Revenue Icon" className="w-12 h-12 mb-2" />
                                <p className="text-base  mb-1">Purchases</p>
                                <p className="font-bold text-gray-600 text-2xl">$ {Number(Tpurchase).toLocaleString()} </p>
                            </div>
                            {/* Column 4 */}
                            <div className="text-center flex-1 flex flex-col items-center">
                                <img src="/public/Revenue.png" alt="Revenue Icon" className="w-12 h-12 mb-2" />
                                <p className="text-base mb-1">Month Purchase</p>
                                <p className="font-bold text-gray-600 text-2xl">$ {Number(Mpurchase).toLocaleString()} </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-lg ml-3" style={{ flex: 1, maxHeight: '12rem' }}>
                        <h2 className="text-lg text-left font-semibold mb-4">Returns</h2>
                        <div className="flex">
                            <div className="text-center flex-1 flex flex-col items-center">
                                <img src="/public/Quantity.png" alt="Sales Icon" className="w-12 h-12 mb-2" />
                                <p className="text-2xl text-gray-600">$ {salesR}</p>

                                <p className="text-base mb-1">POS returns</p>
                            </div>
                            <div className="text-center flex-1 flex flex-col items-center">
                                <img src="/public/On the way.png" alt="Revenue Icon" className="w-12 h-12 mb-2" />
                                <p className="text-2xl text-gray-600">${purchasedR}</p>

                                <p className="text-base mb-1">To be received</p>
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
